const express = require("express");
const { signup, signIn } = require("./users.controllers");
const passport = require("passport");

const router = express.Router();

router.post("/signup", signup);

router.post(
  "/signIn",
  passport.authenticate("local", { session: false }),
  signIn
);
module.exports = router;
