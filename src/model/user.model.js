const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.plugin(require("mongoose-timestamp"));

const User = mongoose.model("USER", userSchema);
module.exports = User;
