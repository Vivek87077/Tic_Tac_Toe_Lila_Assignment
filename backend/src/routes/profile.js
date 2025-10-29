import express from "express";
import User from "../models/User.js";

const router = express.Router();

// 🧩 Create new user
router.post("/create", async (req, res) => {
  try {
    const { nickname } = req.body;

    if (!nickname || nickname.trim() === "") {
      return res.status(400).json({ message: "Nickname is required" });
    }

    const existingUser = await User.findOne({ nickname });
    if (existingUser) {
      return res.json({
        message: "User already exists",
        userId: existingUser._id,
        nickname: existingUser.nickname,
      });
    }

    const user = new User({ nickname });
    await user.save();

    res.json({ userId: user._id, nickname: user.nickname });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error creating user" });
  }
});

// 🧩 Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error fetching user" });
  }
});

export default router;
