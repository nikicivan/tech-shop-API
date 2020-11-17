import Coupon from "../models/Coupon.js";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc Create Coupon
// @route POST /api/coupons
// @access Private/Admin
export const createCoupon = asyncHandler(async (req, res, next) => {
  const { name, expired, discount } = req.body;
  const coupon = await new Coupon({
    name,
    expired,
    discount,
  }).save();

  res.status(201).json(coupon);
});

// @desc Remove Coupon
// @route DELETE /api/coupons
// @access Private/Admin
export const removeCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id).exec();

  if (!coupon) {
    return next(
      new ErrorResponse(`There is no coupon with ${req.params.id}`, 400),
    );
  }

  res.status(200).json({ ok: true });
});

// @desc Fetch All Coupons
// @route GET /api/coupons
// @access Private/Admin
export const listCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).exec();

  if (!coupons) {
    return next(new ErrorResponse("There is no coupons in db", 400));
  }

  res.status(200).json(coupons);
});

// @desc Apply coupon to user cart
// @route POST /api/carts/user/cart
// @access Private
export const applyCouponToUserCart = asyncHandler(async (req, res, next) => {
  const validCoupon = await Coupon.findOne({ name: req.body.coupon.coupon })
    .exec();

  if (validCoupon === null) {
    return next(
      new ErrorResponse(`Coupon ${req.body.coupon.coupon} is not valid.`, 400),
    );
  }

  const user = await User.findOne({ email: req.user.email }).exec();

  if (!user) {
    return next(
      new ErrorResponse(`User ${req.user.email} does not exist.`, 400),
    );
  }

  const { products, cartTotal } = await Cart.findOne({ orderedBy: user._id })
    .populate("products.product", "_id title price")
    .exec();

  // calculate total after the discount
  const totalAfterDiscount =
    (cartTotal - (cartTotal * validCoupon.discount) / 100).toFixed(2);

  const usedCoupon = true;

  await Cart.findOneAndUpdate(
    { orderedBy: user._id },
    { totalAfterDiscount, usedCoupon },
    { new: true },
  );

  res.status(200).json({ validCoupon, totalAfterDiscount, usedCoupon });
});
