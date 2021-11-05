const express = require("express");
const shop = require("../../db/models/Shop");
const upload = require("../../middleware/multer"); // upload is a middleware that i only want
// post and put middlewares to work

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

router.post("/", upload.single("image"), shopCreate); // "image" this needs to be exactly the same as our model file.

router.post("/:shopId/products", upload.single("image"), productCreate); // "image" this needs to be exactly the same as our model file.

module.exports = router;
