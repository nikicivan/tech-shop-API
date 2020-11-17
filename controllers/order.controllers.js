import Order from "../models/Order.js";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import uniqueid from "uniqueid";

// @desc Create Order
// @route POST /api/orders
// @access Private
export const createOrder = asyncHandler(async (req, res, next) => {
  const { paymentIntent } = req.body.stripeResponse;
  const user = await User.findOne({ email: req.user.email }).exec();

  if (!user) {
    return next(
      new ErrorResponse(`User ${req.user.email} does not exist.`, 400),
    );
  }

  const { products } = await Cart.findOne({ orderedBy: user._id }).exec();

  if (!products) {
    return next(new ErrorResponse(`User ${user._id} have no cart items.`, 400));
  }

  const newOrder = await new Order({
    products,
    paymentIntent,
    orderedBy: user._id,
  }).save();

  // console.log("New Order saved", newOrder);

  // decrement qty, increment sold
  const bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: {
          _id: item.product._id,
        },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  const updated = await Product.bulkWrite(bulkOption, { new: true });
  // console.log("updated ----->", updated);

  res.status(201).json({ ok: true });
});

// @desc Fetch Order by User
// @route GET /api/orders
// @access Private
export const getOrders = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  if (!user) {
    return next(
      new ErrorResponse(`User ${req.user.email} does not exist.`, 400),
    );
  }

  const userOrders = await Order.find({ orderedBy: user._id })
    .sort("-createdAt")
    .populate("products.product")
    .populate("orderedBy")
    .exec();

  if (!userOrders) {
    return next(
      new ErrorResponse(`User ${user._id} does not have any order.`, 400),
    );
  }

  res.status(200).json(userOrders);
});

// @desc Fetch All Orders (Admin)
// @route GET /api/orders/admin
// @access Private/Admin
export const getOrdersAdmin = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({})
    .sort("-createdAt")
    .populate("products.product")
    .populate("orderedBy")
    .exec();

  if (!orders) {
    return next(new ErrorResponse("There is no order in database...", 400));
  }

  res.status(200).send(orders);
});

// @desc Update order status (admin)
// @route PUT /api/orders/admin
// @access Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { orderId, orderStatus } = req.body;

  const updated = await Order.findByIdAndUpdate(orderId, { orderStatus }, {
    new: true,
  }).exec();

  if (!updated) {
    return next(
      new ErrorResponse(`Order with id ${orderId} does not exist`, 400),
    );
  }

  res.status(200).json(updated);
});

// @desc Create Cash on delivery Order
// @route POST /api/orders/cod
// @access Private
export const createCashOrder = asyncHandler(async (req, res, next) => {
  const { trigger } = req.body;

  if (!trigger) {
    return next(new ErrorResponse("Create cash order failed.", 400));
  }

  const user = await User.findOne({ email: req.user.email }).exec();

  if (!user) {
    return next(
      new ErrorResponse(`User ${req.user.email} does not exist.`, 400),
    );
  }

  const userCart = await Cart.findOne({ orderedBy: user._id }).exec();

  if (!userCart) {
    return next(new ErrorResponse(`User ${user._id} have no cart items.`, 400));
  }

  const { totalAfterDiscount, usedCoupon } = await Cart.findOne(
    { orderedBy: user._id },
  ).exec();

  const newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: uniqueid(),
      amount: usedCoupon ? totalAfterDiscount * 100 : userCart.cartTotal * 100,
      status: "Cash On Delivery",
      created: Date.now(),
      payment_method_types: ["cash"],
    },
    orderedBy: user._id,
  }).save();

  // console.log("New Order saved", newOrder);

  // decrement qty, increment sold
  const bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: {
          _id: item.product._id,
        },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  const updated = await Product.bulkWrite(bulkOption, { new: true });
  // console.log("updated ----->", updated);

  res.status(201).json({ ok: true });
});
