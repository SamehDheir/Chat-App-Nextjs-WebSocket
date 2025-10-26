const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all users (for searching)
router.get("/search", auth, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } }, // Exclude current user
        {
          $or: [
            { username: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } },
          ],
        },
      ],
    })
      .select("username email avatar isOnline lastSeen")
      .limit(20);

    res.json({ users });
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get online users
router.get("/online", auth, async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
      isOnline: true,
    })
      .select("username email avatar isOnline lastSeen")
      .limit(50);

    res.json({ users });
  } catch (error) {
    console.error("Get online users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { username, avatar } = req.body;
    const updates = {};

    if (username) {
      // Check if username is already taken
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }

      updates.username = username;
    }

    if (avatar) {
      updates.avatar = avatar;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
