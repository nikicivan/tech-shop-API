import Sub from "../models/Sub.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import slugify from "slugify";
import Product from "../models/Product.js";

// @desc Create new sub category
// @route POST /api/sub
// @access Private/Admin
export const createSub = asyncHandler(async (req, res, next) => {
  const { name, parent } = req.body;
  const nameSub = await Sub.findOne({ name });
  if (nameSub) {
    return next(
      new ErrorResponse(`Sub ${req.body.name} already exist.`, 400),
    );
  }
  const sub = await new Sub({
    name,
    parent,
  }).save();
  res.json(sub);
});

// @desc List all sub categories
// @route GET /api/sub
// @access Public
export const listSub = asyncHandler(async (req, res, next) => {
  const subs = await Sub.find({})
    .populate("categories")
    .sort({ createdAt: -1 })
    .exec();
  if (!subs) {
    return next(new ErrorResponse("There is no subs in database"));
  }

  res.status(200).json(subs);
});

// @desc Get sub by slug
// @route GET /api/sub/:slug
// @access Public
export const getSub = asyncHandler(async (req, res, next) => {
  const sub = await Sub.findOne({ slug: req.params.slug })
    .populate("categories")
    .exec();

  const products = await Product.find({ subs: sub })
    .populate("category")
    .populate("subs")
    .exec();

  if (!sub) {
    return next(
      new ErrorResponse(`Sub ${req.params.slug} does not exist`, 400),
    );
  }

  if (!products) {
    return next(
      new ErrorResponse(
        `There is no products related with sub-category ${req.params.slug}`,
        400,
      ),
    );
  }

  res.status(200).json({ sub, products });
});

// @desc Remove sub by slug
// @route DELETE /api/sub/:slug
// @access Private/Admin
export const removeSub = asyncHandler(async (req, res, next) => {
  let sub = await Sub.findOne({ slug: req.params.slug }).exec();

  if (!sub) {
    return next(
      new ErrorResponse(`Sub ${req.params.slug} does not exist`),
    );
  }

  sub.remove();
  res.json({});
});

// @desc Update sub by slug
// @route PUT /api/sub/:slug
// @access Private/Admin
export const updateSub = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const nameSub = await Sub.findOne({ slug: req.params.slug });
  if (!nameSub) {
    return next(
      new ErrorResponse(`Sub ${req.params.slug} does not exist`, 400),
    );
  }

  const updatedSub = await Sub.findOneAndUpdate(
    { slug: req.params.slug },
    { name, slug: slugify(name) },
    {
      new: true,
    },
  );

  res.status(200).json(updatedSub);
});
