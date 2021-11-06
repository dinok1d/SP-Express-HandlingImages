const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcrypt");
const User = require("../db/models/User");
const { JWT_SECRET } = require("../apis/users/config/Keys");

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });
    const passwordMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (passwordMatch) return done(null, user); // returns user as newUser if the passwords are matched

    return done(null, false);
  } catch {
    done(null, false);
  }
});

// it takens in two parameters, an object and function.
exports.jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(), // this is to use the bearertoken recieved
    secretOrKey: JWT_SECRET,
  },
  async (payload, done) => {
    //jwtStrategy will decode the token and put it in the payload automatically
    if (Date.now() > payload.exp) {
      // if the token  is expired
      return done(null, false); // returns a 401 (unauthorized)
    }
    try {
      const user = await User.findById(payload._id);
      return done(null, user); //will return user as the req.user, (when we put null as an argument, it means theres no error, and here take the user )
    } catch (error) {
      done(error); // if we put one parameter in done, it will send to the error handling middleware
    }
  }
);
