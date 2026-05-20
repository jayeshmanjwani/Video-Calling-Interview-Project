import express from "express";
import { getStreamToken } from "../controllers/chatController.js";
import { executeCode } from "../controllers/codeController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);
router.post("/execute", protectRoute, executeCode);

export default router;
