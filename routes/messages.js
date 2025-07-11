const express = require("express");
const router = express.Router();
const { Message } = require("../models/message");
const { User } = require("../models/user");

router.use(express.json());

// Load recent chats for sidebar
router.get("/conversations/:username", async (req, res) => {
  const username = req.params.username;

  // 1. Group by the other user in the conversation
  const chats = await Message.aggregate([
    {
      $match: {
        $or: [{ sender: username }, { receiver: username }],
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [{ $eq: ["$sender", username] }, "$receiver", "$sender"],
        },
        lastMessage: { $first: "$text" },
        lastAt: { $first: "$createdAt" },
      },
    },
    { $sort: { lastAt: -1 } },
  ]);

  const usernames = chats.map((c) => c._id);

  console.log("Aggregated usernames:", usernames);

  // 2. Get details of each user
  const users = await User.find(
    { username: { $in: usernames } },
    { username: 1, name: 1, email: 1 } // only required fields
  );

  // 3. Merge data
  const enriched = chats.map((chat) => {
    const user = users.find((u) => u.username === chat._id);
    return {
      _id: user?._id,
      username: user?.username,
      name: user?.name,
      email: user?.email,
      lastMessage: chat.lastMessage,
      lastAt: chat.lastAt,
    };
  });
  console.log(enriched);
  res.send(enriched);
});

// to supply sender/receiver messages
router.get("/:sender/:receiver", async (req, res) => {
  console.log(`${req.params.sender} | ${req.params.receiver}`);
  const messages = await Message.find({
    $or: [
      {
        sender: req.params.sender,
        receiver: req.params.receiver,
      },
      {
        sender: req.params.receiver,
        receiver: req.params.sender,
      },
    ],
  }).select("sender receiver text sentAt");

  if (messages.length === 0 || !messages) return res.send([]);

  res.send(messages);
});

module.exports = router;
