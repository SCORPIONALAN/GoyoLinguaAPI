import express from 'express';
import { chatQuestion } from '../controllers/chat.controller.mjs';
import { verifyUser } from '../middleware/auth.mjs';
import { MiddlewarePrompt } from '../middleware/req.middleware.mjs';

const router = express.Router();
router.post('/ask',verifyUser, MiddlewarePrompt, chatQuestion);
export default router;