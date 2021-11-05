const Shop = require("../../db/models/Shop");
const Product = require("../../db/models/Product");

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
  }
};

exports.shopCreate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    const newShop = await Shop.create(req.body);
    return res.status(201).json(newShop);
  } catch (error) {
    next(error);
  }
};

exports.productCreate = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    console.log("before", req.body.product);
    req.body.product = req.params.shopId; // everytime i add the a product, i need to update the shop that i've added a new product
    console.log("after", req.body.product); // it added the ID
    // console.log("this is the path", req.file.path);
    // console.log("this is the filename", req.file.filename);
    const newProduct = await Product.create(req.body);
    await Shop.findByIdAndUpdate(
      {
        _id: req.params.shopId,
      },
      {
        $push: { products: newProduct._id },
      }
    );
    return res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};
