const express = require("express");
const multer = require("multer");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const auth = require("../middleware/auth");
const Message = require("../models/Message");
const Chat = require("../models/Chat");

const router = express.Router();

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "chat-images", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [
      {
        width: 800,
        height: 600,
        crop: "limit",
        quality: "auto:good",
        format: "auto",
      },
    ],
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Upload image message
router.post("/upload-image", auth, upload.single("image"), async (req, res) => {
  try {
    const { chatId, caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    if (!chatId) {
      return res.status(400).json({ message: "Chat ID is required" });
    }

    // Check if chat exists and user is member
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (!chat.participants.includes(req.user.id)) {
      return res
        .status(400)
        .json({ message: "You are not a member of this chat" });
    }

    // Create message with image
    const message = new Message({
      sender: req.user.id,
      chat: chatId,
      content: caption || "",
      messageType: "image",
      imageUrl: req.file.path, // Cloudinary URL
      imageName: req.file.originalname,
      imageSize: req.file.size,
    });

    await message.save();
    await message.populate("sender", "username avatar");

    // Update chat's last message
    chat.messages.push(message._id);
    chat.lastMessage = message._id;
    chat.lastActivity = new Date();
    await chat.save();

    // Send message via Socket.io to all chat participants
    const io = req.app.get("io");
    if (io) {
      const messageToSend = {
        _id: message._id,
        sender: {
          _id: message.sender._id,
          username: message.sender.username,
          avatar: message.sender.avatar,
        },
        content: message.content,
        messageType: message.messageType,
        imageUrl: message.imageUrl,
        imageName: message.imageName,
        imageSize: message.imageSize,
        createdAt: message.createdAt,
        isEdited: message.isEdited,
        readBy: [],
      };

      io.to(chatId).emit("newMessage", {
        chatId,
        message: messageToSend,
      });
    }

    res.status(201).json(message);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Redirect to Cloudinary image (if needed for backward compatibility)
router.get("/uploads/:filename", (req, res) => {
  // Since we're using Cloudinary, images are served directly from there
  // This endpoint can be removed or used for backward compatibility
  res.status(404).json({ message: "Images are now served from Cloudinary" });
});

module.exports = router;
