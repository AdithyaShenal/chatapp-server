const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const { Friend } = require("../models/friend");

router.use(express.json());

// Get all friends (Checked ✔️)
router.get("/", async (req, res) => {
  const friends = await Friend.find();
  res.send(friends);
});

// Get all friends of a user (Checked ✔️)
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).send("User with given ID not found");

  const friends = await Friend.find({
    userId: req.params.id,
    status: "friends",
  }).select("friendId");
  if (friends.length === 0) return res.send([]);

  const friendIds = friends.map((f) => f.friendId);

  const friendList = await User.find({ _id: { $in: friendIds } }).select(
    "username name email _id"
  );

  res.send(friendList);
});

// Create a friend (Checked ✔️)
router.post("/:user_id/:friend_id", async (req, res) => {
  const user_1 = await User.findById(req.params.user_id);
  if (!user_1) return res.status(404).send("User with given ID not found.");

  const user_2 = await User.findById(req.params.friend_id);
  if (!user_2) return res.status(404).send("Friend with given ID not found.");

  let friend = await Friend.findOne({
    userId: req.params.user_id,
    friendId: req.params.friend_id,
  });

  if (friend) return res.status(400).send("Already friends.");

  friend = new Friend({
    userId: user_1._id,
    friendId: user_2._id,
  });

  friend.save();
  res.send(friend);
});

// Update a friend (Checked ✔️)
router.put("/block/:id", async (req, res) => {
  const friend = await Friend.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        status: "blocked",
      },
    },
    { new: true }
  );
  if (!friend) return res.status(404).send("Friend with given ID not found.");

  res.send(friend);
});

// Remove a friends (Checked ✔️)
router.delete("/:id", async (req, res) => {
  const friend = await Friend.findByIdAndDelete(req.params.id);
  if (!friend) return res.status(404).send("Friend with given ID not found.");

  res.send(friend);
});

module.exports = router;
