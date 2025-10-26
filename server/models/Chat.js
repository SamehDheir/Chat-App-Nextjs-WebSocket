const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    chatType: {
      type: String,
      enum: ["private", "group"],
      required: true,
    },
    chatName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    chatDescription: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    chatAvatar: {
      type: String,
      default: "",
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
chatSchema.index({ participants: 1 });
chatSchema.index({ lastActivity: -1 });

module.exports = mongoose.model("Chat", chatSchema);
