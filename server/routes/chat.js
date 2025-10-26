const express = require("express");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Get user's chats
router.get("/", auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      isActive: true,
    })
      .populate("participants", "username email avatar isOnline lastSeen")
      .populate("lastMessage")
      .populate({
        path: "lastMessage",
        populate: {
          path: "sender",
          select: "username",
        },
      })
      .sort({ lastActivity: -1 });

    res.json({ chats });
  } catch (error) {
    console.error("Get chats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create private chat
router.post("/private", auth, async (req, res) => {
  try {
    const { participantId } = req.body;

    if (!participantId) {
      return res.status(400).json({ message: "Participant ID is required" });
    }

    if (participantId === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot create chat with yourself" });
    }

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      chatType: "private",
      participants: { $all: [req.user._id, participantId] },
    });

    if (existingChat) {
      return res.status(400).json({ message: "Chat already exists" });
    }

    // Create new private chat
    const chat = new Chat({
      participants: [req.user._id, participantId],
      chatType: "private",
    });

    await chat.save();
    await chat.populate(
      "participants",
      "username email avatar isOnline lastSeen"
    );

    res.status(201).json({ chat });
  } catch (error) {
    console.error("Create private chat error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create group chat
router.post("/group", auth, async (req, res) => {
  try {
    const { chatName, chatDescription, participantIds } = req.body;

    if (!chatName || !participantIds || participantIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Chat name and participants are required" });
    }

    // Add creator to participants if not included
    const participants = [
      ...new Set([req.user._id.toString(), ...participantIds]),
    ];

    // Validate participants exist
    const validParticipants = await User.find({ _id: { $in: participants } });
    if (validParticipants.length !== participants.length) {
      return res
        .status(400)
        .json({ message: "Some participants do not exist" });
    }

    // Create group chat
    const chat = new Chat({
      participants,
      chatType: "group",
      chatName,
      chatDescription,
      admin: req.user._id,
    });

    await chat.save();
    await chat.populate(
      "participants",
      "username email avatar isOnline lastSeen"
    );

    res.status(201).json({ chat });
  } catch (error) {
    console.error("Create group chat error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get chat messages
router.get("/:chatId/messages", auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Check if user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Get messages with pagination
    const messages = await Message.find({ _id: { $in: chat.messages } })
      .populate("sender", "username avatar")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Send message
router.post("/:chatId/messages", auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, messageType = "text" } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Message content is required" });
    }

    // Check if user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Create message
    const message = new Message({
      sender: req.user._id,
      content: content.trim(),
      messageType,
    });

    await message.save();
    await message.populate("sender", "username avatar");

    // Update chat
    chat.messages.push(message._id);
    chat.lastMessage = message._id;
    chat.lastActivity = new Date();
    await chat.save();

    res.status(201).json({ message });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete chat
router.delete("/:chatId", auth, async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // For group chats, only admin can delete
    if (
      chat.chatType === "group" &&
      chat.admin.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Only admin can delete group chat" });
    }

    chat.isActive = false;
    await chat.save();

    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Delete chat error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
