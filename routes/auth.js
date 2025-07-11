const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const Joi = require("joi");

router.use(express.json());

// User Authentication (Simplified Logic - i will extend this later )
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Invalid Username or Pasword");

  if (user.password !== req.body.password)
    return res.status(400).send("Invalid Username or Pasword");

  res.send({
    _id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    dateOfBirth: user.dateOfBirth,
    validation: "successful",
  });
});

function validate(auth) {
  const schema = Joi.object({
    username: Joi.string().min(3).required(),
    password: Joi.string().min(3).required(),
  });

  return schema.validate(auth);
}

module.exports = router;
