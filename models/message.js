const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  text: { type: String },
  sentAt: { type: Date, default: Date.now() },
  read: { type: Boolean, default: false },
});

const Message = mongoose.model("Message", messageSchema);

module.exports.Message = Message;
