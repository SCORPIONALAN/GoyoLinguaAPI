import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.resolve();
export const createTempFolder = () => {
  const tempDir = path.join(__dirname, 'temp_audios');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
};

export const downloadAudio = async (url) => {
  const tempDir = path.join(__dirname, 'temp_audios');
  const audioName = `audio_${uuidv4()}.mp3`; // UUID único
  const audioPath = path.join(tempDir, audioName);

  const response = await axios.get(url, { responseType: 'stream' });
  const writer = fs.createWriteStream(audioPath);

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(audioPath));
    writer.on('error', reject);
  });
};