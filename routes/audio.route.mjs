import express from 'express';
import { processAudio } from '../controllers/audio.controller.mjs';
import { verifyUser } from '../middleware/auth.mjs';
const router = express.Router();
router.post('/evaluate', verifyUser, processAudio);
export default router;