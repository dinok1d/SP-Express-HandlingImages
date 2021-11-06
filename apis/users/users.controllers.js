const User = require("../../db/models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("./config/Keys");

const generateToken = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
    exp: Date.now() + JWT_EXPIRATION_MS, // number in miliseconds
  };
  const token = jwt.sign(payload, JWT_SECRET); // JWT_Secret is basically an extension
  // that is given to our users when they log in. so the BE knows the user was created
  // from the BE and not a random user logging into our system
  return token;
};

exports.signup = async (req, res, next) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    req.body.password = hashedPassword;

    const newUser = await User.create(req.body);

    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

exports.signIn = (req, res) => {
  const token = generateToken(req.user);
  res.json({ token });
};
