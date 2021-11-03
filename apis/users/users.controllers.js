const User = require("../../db/models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../../db/models/Keys");

exports.signup = async (req, res, next) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = hashedPassword;

    const newUser = await User.create(req.body);

    const payload = {
      _id: newUser._id,
      username: newUser.username,
      exp: Date.now() + JWT_EXPIRATION_MS, // number in miliseconds
    };

    const token = jwt.sign(payload, JWT_SECRET);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};
