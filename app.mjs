import express from 'express';
import dotenv from 'dotenv';
import audioRoutes from './routes/audio.route.mjs';
import chatRoutes from './routes/chat.route.mjs';
import { createTempFolder } from './utils/fileUtils.mjs';
import { MiddlewarePrompt } from './middleware/req.middleware.mjs';


dotenv.config();
const app = express();
app.use(express.json());

// Para permitir JSON más grandes y datos mas grandes (audios)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Crear carpeta temporal si no existe
createTempFolder();

// Rutas
app.use('/api/audio', audioRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT;
app.listen(PORT);