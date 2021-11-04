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
