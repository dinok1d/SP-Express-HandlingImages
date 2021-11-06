const express = require("express");
const upload = require("../../middleware/multer"); // upload is a middleware that i only want
// post and put middlewares to work
const passport = require("passport");

const {
  shopListFetch,
  shopCreate,
  productCreate,
  fetchshop,
} = require("../shops/shops.controller");

// Create a mini express application
const router = express.Router();

// Param Middleware
router.param("shopId", async (req, res, next, shopId) => {
  const shop = await fetchshop(shopId, next);
  if (shop) {
    req.shop = shop;
    next();
  } else {
    next({ status: 404, message: "shop Not Found!" });
  }
});

router.get("/", shopListFetch);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }), // by doing this line, i have given the shopCreate function the ability to get the exports.jwtStrategy which gives us a user as a req.user (basically i need to be authorized to do this function)
  upload.single("image"),
  shopCreate
); // "image" this needs to be exactly the same as our model file.

router.post(
  "/:shopId/products", // :ShopId will give us the req.shop.owner
  passport.authenticate("jwt", { session: false }), // this line give access to productCreate the accessed user
  //  and if the user is logged in, it will save it in req.user
  upload.single("image"),
  productCreate
); // "image" this needs to be exactly the same as our model file.

module.exports = router;
