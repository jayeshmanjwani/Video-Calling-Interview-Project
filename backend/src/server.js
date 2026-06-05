import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import { Webhook } from "svix";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";
import User from "./models/User.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

const __dirname = path.resolve();

// middleware
app.use(express.json());
// credentials:true meaning?? => server allows a browser to include cookies on request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware()); // this adds auth field to request object: req.auth()

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/ai", aiRoutes);

// Clerk webhook to sync users with database
app.post("/api/webhooks/clerk", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const SIGNING_SECRET = ENV.CLERK_WEBHOOK_SECRET;
    if (!SIGNING_SECRET) {
      throw new Error("CLERK_WEBHOOK_SECRET is not set");
    }

    const wh = new Webhook(SIGNING_SECRET);
    const evt = wh.verify(req.body, req.headers);

    if (evt.type === "user.created" || evt.type === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
      const email = email_addresses[0]?.email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      if (evt.type === "user.created") {
        // Create new user
        await User.create({
          clerkId: id,
          email,
          name,
          profileImage: image_url || "",
        });
      } else {
        // Update existing user
        await User.findOneAndUpdate(
          { clerkId: id },
          { email, name, profileImage: image_url || "" },
          { new: true }
        );
      }
    }

    if (evt.type === "user.deleted") {
      const { id } = evt.data;
      await User.deleteOne({ clerkId: id });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error handling Clerk webhook:", error.message);
    res.status(400).json({ message: "Webhook error" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// Development route to serve frontend
app.get("/", (req, res) => {
  res.json({ msg: "API is running. Connect your frontend to use this API." });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return next();
  }

  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
}



// ========================================
// Code Execution Route
// ========================================

const LANGUAGE_VERSIONS = {
  javascript: {
    language: "javascript",
    version: "18.15.0",
  },
  python: {
    language: "python",
    version: "3.10.0",
  },
  java: {
    language: "java",
    version: "15.0.2",
  },
};

// ========================================
// Execute Code API
// ========================================

app.post("/api/run", async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!language || !code) {
      return res.status(400).json({
        success: false,
        error: "Language and code are required",
      });
    }

    // Judge0 Language IDs
    const languageMap = {
      javascript: 63, // Node.js
      python: 71,     // Python 3
      java: 62,       // Java
    };

    const language_id = languageMap[language];

    if (!language_id) {
      return res.status(400).json({
        success: false,
        error: "Unsupported language",
      });
    }

    // ========================================
    // Submit Code
    // ========================================

    const submissionResponse = await fetch(
  "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language_id,
      source_code: code,
    }),
  }
);

    const data = await submissionResponse.json();

console.log(JSON.stringify(data, null, 2));

// ========================================
// Extract outputs
// ========================================

// ========================================
// Debug Response
// ========================================

console.log(JSON.stringify(data, null, 2));

// ========================================
// Extract outputs
// ========================================

const stdout = data.stdout || "";
const stderr = data.stderr || "";
const compileOutput = data.compile_output || "";
const message = data.message || "";

const statusId = data.status?.id;
const statusDescription = data.status?.description || "";

// ========================================
// Detect Errors
// ========================================

// Compilation Error
if (compileOutput) {
  return res.json({
    success: false,
    error: compileOutput,
    output: "",
  });
}

// Runtime Error
if (stderr) {
  return res.json({
    success: false,
    error: stderr,
    output: "",
  });
}

// Judge0 internal/system error
if (message) {
  return res.json({
    success: false,
    error: message,
    output: "",
  });
}

// Non-success status
if (statusId && statusId !== 3) {
  return res.json({
    success: false,
    error: statusDescription || "Execution failed",
    output: "",
  });
}

// ========================================
// Success
// ========================================

return res.json({
  success: true,
  output:
    stdout.trim() !== ""
      ? stdout
      : "Program executed successfully with no output",
});
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========================================
// Helper Function
// ========================================

function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  return extensions[language] || "txt";
}

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => console.log("Server is running on port:", ENV.PORT));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
