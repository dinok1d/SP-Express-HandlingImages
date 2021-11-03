const Product = require("../../db/models/Product");
const Shop = require("../../db/models/Shop");

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

exports.shopCreate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    console.log("before", req.body.product);
    req.body.product = req.params.productId; // everytime i add the a product, i need to update the shop that i've added a new product
    console.log("after", req.body.product); // it added the ID
    const newShop = await Shop.create(req.body);
    await Product.findByIdAndUpdate(
      {
        _id: req.params.productId,
      },
      {
        $push: { shops: newShop._id },
      }
    );
    return res.status(201).json(newShop);
  } catch (error) {
    next(error);
  }
};

exports.productDetailFetch = async (req, res, next) =>
  res.status(200).json(req.product);

exports.productCreate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    // console.log("this is the path", req.file.path);
    // console.log("this is the filename", req.file.filename);
    const newProduct = await Product.create(req.body);
    return res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

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
