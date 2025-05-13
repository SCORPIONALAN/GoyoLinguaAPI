import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { downloadAudio } from '../utils/fileUtils.mjs';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const processAudio = async (req, res) => {
  const { audioUrl, expectedText } = req.body;

  try {
    const audioPath = await downloadAudio(audioUrl);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: "whisper-1",
    });

    const analysis = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `
            Evalúa la siguiente transcripción de audio en inglés:
            - Compara con el texto esperado: "${expectedText}".
            - Verifica pronunciación, gramática y coherencia.
            - Devuelve un JSON con: { success: boolean, feedback: string }.
          `,
        },
        { role: "user", content: transcription.text },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(analysis.choices[0].message.content);

    res.json({
      transcription: transcription.text,
      analysis: result,
    });

    // funcion de 30 segundos para eliminar un audio
    setTimeout(() => {
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
        console.log(`Audio ${audioPath} eliminado`);
      }
    }, 30000);

  } catch (error) {
    console.error("Error en processAudio:", error);
    res.status(500).json({ error: "Error al procesar audio" });
  }
};