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

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
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
