import express from 'express';
import { getStreamToken } from '../controllers/chatController.js';
import { protectRoue } from '../middleware/protectRoute.js';

const router = express.Router();

router.get("/token",protectRoue,getStreamToken);
export default router;