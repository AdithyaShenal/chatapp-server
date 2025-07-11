const mongoose = require("mongoose");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 255,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 255,
    required: true,
  },
  dateOfBirth: { type: Date, required: true },
});

const User = mongoose.model("User", userSchema);

const validation = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(5).max(255).required(),
    name: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required(),
    dateOfBirth: Joi.date().required(),
  });

  return schema.validate(user);
};

module.exports.User = User;
module.exports.validation = validation;
