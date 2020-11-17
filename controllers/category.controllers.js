import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Sub from "../models/Sub.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import slugify from "slugify";

// @desc Create new category
// @route POST /api/category
// @access Private/Admin
export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const nameCategory = await Category.findOne({ name });
  if (nameCategory) {
    return next(
      new ErrorResponse(`Category ${req.body.name} already exist.`, 400),
    );
  }
  const category = await new Category({
    name,
  }).save();
  res.json(category);
});

// @desc List all categoies
// @route POST /api/category
// @access Public
export const listCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).sort({ createdAt: -1 }).exec();
  if (!categories) {
    return next(new ErrorResponse("There is no categories in database"));
  }

  res.status(200).json(categories);
});

// @desc Get category by slug
// @route GET /api/category/:slug
// @access Public
export const getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug }).exec();
  const products = await Product.find({ category })
    .populate("category")
    .populate("postedBy", "_id name")
    .exec();

  if (!category) {
    return next(
      new ErrorResponse(`Category ${req.params.slug} does not exist`, 400),
    );
  }

  if (!products) {
    return next(
      new ErrorResponse(
        `There is no products related with category ${req.params.slug}`,
        400,
      ),
    );
  }

  res.status(200).json({ category, products });
});

// @desc Remove category by slug
// @route DELETE /api/category/:slug
// @access Private/Admin
export const removeCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec();

  if (!category) {
    return next(
      new ErrorResponse(`Category ${req.params.slug} does not exist`),
    );
  }

  category.remove();
  res.json({});
});

// @desc Update category by slug
// @route PUT /api/category/:slug
// @access Private/Admin
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const nameCategory = await Category.findOne({ slug: req.params.slug });
  if (!nameCategory) {
    return next(
      new ErrorResponse(`Category ${req.params.slug} does not exist`, 400),
    );
  }

  const updatedCategory = await Category.findOneAndUpdate(
    { slug: req.params.slug },
    { name, slug: slugify(name) },
    {
      new: true,
    },
  );

  res.status(200).json(updatedCategory);
});

// @desc Fetch all sub categories that are related with category
// @route GET /api/category/subs/:id
// @access Public
export const getSubs = asyncHandler(async (req, res, next) => {
  Sub.find({ parent: req.params.id }).exec((error, subs) => {
    if (error) {
      console.log(error);
    }
    res.status(200).json(subs);
  });
});
