const Product = require("../../db/models/Product");

exports.fetchProduct = async (productId, next) => {
  try {
    const product = await Product.findById(productId);
    return product;
  } catch (error) {
    next(error);
  }
};

exports.productListFetch = async (req, res, next) => {
  try {
    const products = await Product.find().populate("shops");
    return res.json(products);
  } catch (error) {
    next(error);
    // return res.status(500).json({ message: error.message });
  }
};

exports.productDetailFetch = async (req, res, next) =>
  res.status(200).json(req.product);

exports.productUpdate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    } // this will give me the file (image) for the model

    const product = await Product.findByIdAndUpdate(
      req.product, // req.body will give us the ID of the pt
      req.body,
      { new: true, runValidators: true } // returns the updated product
    );
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

exports.productDelete = async (req, res, next) => {
  try {
    await req.product.remove();
    res.status(204).end();
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
