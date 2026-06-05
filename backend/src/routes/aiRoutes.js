import express from "express";
import Session from "../models/Session.js";

const router = express.Router();

router.post("/paste-detection", async (req, res) => {
  try {
    const { sessionId } = req.body;

    await Session.findByIdAndUpdate(
      sessionId,
      {
        $inc: {
          suspiciousPasteCount: 1,
        },
      }
    );

    res.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
    });
  }
});

export default router;