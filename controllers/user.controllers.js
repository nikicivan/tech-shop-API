import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc Add wishlist to user
// @route POST /api/user/wishlist
// @access Private
export const addToWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } },
    { new: true },
  ).exec();

  if (!user) {
    return next(
      new ErrorResponse(`There is no user with ${req.user.email}`, 400),
    );
  }

  res.status(200).json({ ok: true });
});

// @desc Get user's wishlist
// @route GET /api/user
// @access Private
export const getWishlist = asyncHandler(async (req, res, next) => {
  const wishlists = await User.findOne({ email: req.user.email })
    .select("wishlist")
    .select("-_id")
    .populate("wishlist")
    .exec();

  if (!wishlists) {
    return next(
      new ErrorResponse(
        `There is no favorite products in wishlist for user ${req.user.email}`,
        400,
      ),
    );
  }

  res.status(200).json(wishlists);
});

// @desc Update user's wishlist
// @route PUT /api/user/wishlist
// @access Private
export const removeWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } },
    { new: true },
  ).exec();

  if (!user) {
    return next(
      new ErrorResponse(`There is no user with ${req.user.email}`, 400),
    );
  }

  res.status(200).json({ ok: true });
});
