const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },

  password: { type: String },

  email: {
    type: String,
    required: "Email address is required",
    // validate: [validateEmail, "please fill a valid email address"],
    // match: []
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
