const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../db/models/User");

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });
    const passwordMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (passwordMatch) return done(null, user);

    return done(null, false);
  } catch {
    done(null, false);
  }
});
