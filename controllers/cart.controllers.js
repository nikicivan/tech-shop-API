import Cart from "../models/Cart.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc Create new cart
// @route POST /api/carts
// @access Private
export const createCart = asyncHandler(async (req, res, next) => {
  //   console.log(req.body);
  const { cart } = req.body;

  let products = [];
  const user = await User.findOne({ email: req.user.email }).exec();

  if (!user) {
    return next(
      new ErrorResponse(`There is no user with ${req.user.email}`, 400),
    );
  }

  // check if cart with logged in user already exist
  let cartExistByThisUser = await Cart.findOne({ orderedBy: user._id }).exec();

  if (cartExistByThisUser) {
    cartExistByThisUser.remove();
    // console.log("removed old cart");
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i].product;
    object.count = cart[i].count;
    object.color = cart[i].color;

    //   get price for creating total
    const { price } = await Product.findById(cart[i].product)
      .populate("product")
      .exec();
    // console.log("price", price);
    object.price = price;
    products.push(object);
  }

  //   console.log("products", products);
  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }

  //   console.log("cartTotal", cartTotal);
  const newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id,
  }).save();

  //   console.log("new cart", newCart);
  res.status(200).json({ ok: true });
});

// @desc Fetch user cart
// @route GET /api/carts
// @access Private
export const getCart = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  const cart = await Cart.findOne({ orderedBy: user._id })
    .populate("products.product", "_id title price totalAfterDiscount")
    .exec();

  // if (!cart) {
  //   return next(
  //     new ErrorResponse(`There is no cart for user ${req.user.email}`, 400),
  //   );
  // }

  const { products, cartTotal, totalAfterDiscount } = cart;

  res.status(200).json({ products, cartTotal, totalAfterDiscount });
});

// @desc Empty user cart
// @route PUT /api/carts
// @access Private
export const emptyCart = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  if (!user) {
    return next(
      new ErrorResponse(`There is no user with ${req.user.email}`, 400),
    );
  }

  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();

  res.status(201).json({ ok: true });
});

// @desc Save user address
// @route POST /api/carts/address
// @access Private
export const saveAddress = asyncHandler(async (req, res, next) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    {
      address: req.body.address,
      city: req.body.city,
      postalCode: req.body.postalCode,
      country: req.body.country,
    },
  ).exec();

  if (!userAddress) {
    return next(new ErrorResponse(`There is no user ${req.user.email}`, 400));
  }

  res.json({ ok: true });
});
