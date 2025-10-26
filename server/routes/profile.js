const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Configure Cloudinary storage for profile pictures
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "profile-pictures", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
    transformation: [
      {
        width: 300,
        height: 300,
        crop: "fill",
        gravity: "face",
        quality: "auto:good",
        format: "auto",
      },
    ],
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for profile pictures
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Update profile with optional avatar upload
router.put("/update", auth, upload.single("avatar"), async (req, res) => {
  try {
    const { username, email, bio, phone, location } = req.body;
    const updateData = {};

    // Add fields that are provided
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (bio) updateData.bio = bio;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;

    // Add avatar if uploaded
    if (req.file) {
      updateData.avatar = req.file.path; // Cloudinary URL
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Upload avatar only
router.post(
  "/upload-avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // Update user's avatar
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: req.file.path }, // Cloudinary URL
        { new: true }
      ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Avatar updated successfully",
        avatar: req.file.path,
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  }
);

module.exports = router;
