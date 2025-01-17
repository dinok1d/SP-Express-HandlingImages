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
    // this has access to req.user from shop.routes
    if (req.file) {
      req.body.image = `http://${req.get("host")}/media/${req.file.filename}`;
    }
    req.body.owner = req.user._id;
    const newShop = await Shop.create(req.body);
    await newShop.populate({
      path: "owner",
      select: "username",
    });
    return res.status(201).json(newShop);
  } catch (error) {
    next(error);
  }
};

exports.productCreate = async (req, res, next) => {
  //

  console.log(req.user._id);
  console.log(req.shop.owner._id);
  if (!req.user._id.equals(req.shop.owner._id)) {
    // only the creator the shop can create products and we achieved this by two middlewares
    // we got the req.user from the passport jwt
    //  we got the req.shop.owner from router.param in shop routes
    return next({
      status: 401,
      message: "you're not the owner",
    });
  }
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

// i'm getting a glitch where if i sign up and get a token from sign up is different from the sign in
//therefore if i sign up and create.  i won't be able to use the same token to create product
// i have to sign in then create
