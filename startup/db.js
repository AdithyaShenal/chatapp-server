const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
  const mongodb = config.get("db");
  mongoose.connect(mongodb);
};
