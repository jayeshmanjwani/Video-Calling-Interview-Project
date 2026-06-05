import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    problem: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    // stream video call ID
    callId: {
      type: String,
      default: "",
    },

    warnings: [
      {
        type: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    tabSwitchCount: {
      type: Number,
      default: 0,
    },

    suspiciousPasteCount: {
      type: Number,
      default: 0,
    },

    attentionScore: {
      type: Number,
      default: 100,
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
