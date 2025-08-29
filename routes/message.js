const express = require("express");
const { usermiddleware } = require("../midleware/authMiddle");
const { Message } = require("../model/message");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

// Fetch all messages between logged in user and another user
router.get("/fetchMessage/:id", usermiddleware, async (req, res) => {
  try {
    const { id: userToChat } = req.params;
    const myId = req.user._id;

    const message = await Message.find({
      $or: [
        { senderId: myId, recieverId: userToChat },
        { senderId: userToChat, recieverId: myId },
      ],
    }).sort({ createdAt: 1 }); // optional: sort by time

    res.status(200).json(message);
  } catch (error) {
    console.error("Error in getting message:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Send a message (text + optional image)
router.post("/sendMessage/:id", usermiddleware, async (req, res) => {
  try {
    const { image, text } = req.body;
    const { id: recieverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = null;

    // only upload if image is provided
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sending message:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
