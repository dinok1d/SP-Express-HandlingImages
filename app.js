// first step is yarn add cors
// yarn add jsonwebtoken
// yarn add bcrypt
// yarn add passport passport-local
// yarn add passport-jwt
// in order to use authorization in postman, i need to go into the product create,
// authrization - type bearer token and put a token.

const express = require("express");
const cors = require("cors"); // we need to require cors inorder to app.use it
const morgan = require("morgan");
const path = require("path");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middleware/passport");

//our routes
const productRoutes = require("./apis/products/products.routes");
const shopRoutes = require("./apis/shops/shop.routes");
const userRoutes = require("./apis/users/users.routes");

// our databases
const connectDB = require("./db/database");

//Middleware
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const app = express();

connectDB();

// Middleware
app.use(cors()); // this is to remove the accessisbility issue when trying to connect BE to FE
app.use(express.json());
app.use(morgan("dev"));
app.use(logger);
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy); // when do we want to use jwtStrategy? which basically
//creates a authentication method for our system. for any route we want to protect
app.use((req, res, next) => {
  if (req.body.name === "Broccoli Soup")
    res.status(400).json({ message: "I HATE BROCCOLI!! KEEFY! " });
  else next();
});

// Routes
app.use("/media", express.static(path.join(__dirname, "media"))); // the idea behind this line
// is that we need to create a route for our server in order to access it!
//also this middleware now generates paths for our files/items in media folder in the frontend
// important note is that we need to create a media folder in the main url
app.use("/api/products", productRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api", userRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Path not found" });
});

app.use(errorHandler);

const PORT = 8000;
app.listen(PORT, () => console.log(`Application running on localhost:${PORT}`));
