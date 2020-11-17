import User from "../models/User.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Coupon from "../models/Coupon.js";
import Stripe from "stripe";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc Controller for stripe payment
// @route POST /api/stripe/create-payment-intent
// @access Private
export const createPaymentIntent = asyncHandler(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET);

  const user = await User.findOne({ email: req.user.email }).exec();

  if (!user) {
    return next(
      new ErrorResponse(`User ${req.user.email} does not exist`, 400),
    );
  }

  const { cartTotal, totalAfterDiscount, usedCoupon } = await Cart.findOne(
    { orderedBy: user._id },
  ).exec();

  const paymentIntent = await stripe.paymentIntents.create({
    amount: usedCoupon ? totalAfterDiscount * 100 : cartTotal * 100,
    currency: "rsd",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
