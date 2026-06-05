import express from "express";

const router = express.Router();

router.post("/tab-switch", async (req, res) => {
   res.json({ success: true });
});

router.post("/paste-detection", async (req, res) => {
   res.json({ success: true });
});

export default router;