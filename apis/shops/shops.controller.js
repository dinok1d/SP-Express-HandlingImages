const Shop = require("../../db/models/Shop");

exports.fetchshop = async (shopId, next) => {
  try {
    const shop = await Shop.findById(shopId);
    return shop;
  } catch (error) {
    next(error);
  }
};

exports.shopListFetch = async (req, res, next) => {
  try {
    const shops = await Shop.find().populate("products");
    return res.json(shops);
  } catch (error) {
    next(error);
    // return res.status(500).json({ message: error.message });
  }
};

exports.shopDetailFetch = async (req, res, next) =>
  res.status(200).json(req.shop);

exports.shopUpdate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    } // this will give me the file (image) for the model

    const shop = await Shop.findByIdAndUpdate(
      req.shop, // req.body will give us the ID of the pt
      req.body,
      { new: true, runValidators: true } // returns the updated shop
    );
    return res.status(200).json(shop);
  } catch (error) {
    next(error);
  }
};

// Create
// Status: 201
// Content: newly created item

// Retrieve (List && Detail)
// Status: 200
// Content: Requested data

// Update
// Status: 200
// Content: updated item

// Delete
// Status: 204
// Content: No Content
