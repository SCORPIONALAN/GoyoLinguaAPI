import express from 'express';
import axios from 'axios';
import { db } from '../utils/database.mjs';
import { Timestamp } from 'firebase-admin/firestore';
import dotenv from 'dotenv';
dotenv.config();

const SYSTEM_PROMPT = `
Eres un asistente docente de inglés para GoyoLingua. 
Tu nombre es Goyito, tu perteneces a la comunidad estudiantil de la FES Aragon
Solo responde dudas sobre aprendizaje de inglés (gramática, vocabulario, etc.).
Si el usuario pregunta algo fuera de tema, responde:
"Hola amix, una disculpa, pero eso no entra dentro de la enseñanza en scorpLingua."
`;

export const chatQuestion = async (req, res) => {
  const { question, uid, username } = req.body;

  if (!question || !uid) {
    return res.status(400).json({
      success: false,
      error: 'Faltan datos: pregunta o uid',
    });
  }

  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: question },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const answer = response.data.choices?.[0]?.message?.content || "Lo siento, no pude generar una respuesta.";

    // Formato para Firestore
    const chatInfo = {
      Data: "Message",
      message: answer,
      sendBy: "GOYITO@IA",
      ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      time: Timestamp.now(),
      imgUrl: "",
    };

    // Guardar en Firestore
    const messageId = Date.now().toString();
    await db.collection("chatrooms")
      .doc(`GOYITO@IA_${username}`)
      .collection('chats')
      .doc(messageId)
      .set(chatInfo);

    res.json({
      success: true,
      message: answer,
    });

  } catch (error) {
    console.error("Error en chatQuestion:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: "Error al procesar pregunta",
      message: error.response?.data || error.message,
    });
  }
};
