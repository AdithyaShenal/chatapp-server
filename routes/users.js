const express = require("express");
const router = express.Router();
const { User, validation } = require("../models/user");

router.use(express.json());

// Get all users (Checked ✔️)
router.get("/", async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// Get a user by Username (Checked ✔️)
router.get("/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).select(
    "_id username email dateOfBirth name"
  );
  if (!user) return res.status(400).send("Given username not found.");
  res.send(user);
});

// Register a user (Checked ✔️)
router.post("/", async (req, res) => {
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user_email = await User.findOne({ email: req.body.email });
  if (user_email) return res.status(400).send("Username already exist.");

  let user_name = await User.findOne({ username: req.body.username });
  if (user_name) return res.status(400).send("Username already exist.");

  const user = new User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    dateOfBirth: req.body.dateOfBirth,
  });

  // Password hashing

  await user.save();
  res.send(user);
  console.log("User Created: ", user);
});

// Update a User (should be send whole updated user object) (Checked ✔️)
router.put("/:id", async (req, res) => {
  const { error } = validation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      username: req.body.username,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      dateOfBirth: req.body.dateOfBirth,
    },
    { new: true }
  );

  if (!user) return res.status(404).send("User with give ID not found.");

  res.send(user);
});

// Delete a user (Checked ✔️)
router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(400).send("Given user ID not found.");

  res.send(user);
});

module.exports = router;
