import Product from "../models/Product.js";
import User from "../models/User.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import {
  handleBrand,
  handleCategory,
  handleColor,
  handlePrice,
  handleQuery,
  handleShipping,
  handleStar,
  handleSub,
} from "../middlewares/products.middleware.js";

// @desc Create new product
// @route POST /api/products
// @access Private/Admin
export const createProduct = asyncHandler(async (req, res, next) => {
  const product = await new Product(req.body).save();
  res.status(201).json(product);
});

// @desc Fetch all product
// @route GET /api/products
// @access Private/Admin
export const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({}).populate("category")
    .sort({ createdAt: -1 })
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("subs")
    .sort({ "createdAt": "desc" })
    .exec();

  if (!products) {
    return next(new ErrorResponse("There is no products in database"));
  }

  res.status(200).json(products);
});

// @desc Delete product by slug
// @route DELETE /api/products/product/:slug
// @access Private/Admin
export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (!product) {
    return next(new ErrorResponse("Product does not exist."));
  }

  await product.remove();

  res.status(200).json({ success: true });
});

// @desc Fetch product by slug
// @route GET /api/product/:slug
// @access Public
export const getProductBySlug = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("subs")
    .exec();

  if (!product) {
    return next(new ErrorResponse("Product does not exist."));
  }

  res.status(200).json(product);
});

// @desc Update product by slug
// @route PUT /api/products/product/:slug
// @access Private/Admin
export const updateProductBySlug = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    price,
    subs,
    shipping,
    quantity,
    images,
    color,
    brand,
    category,
  } = req.body.product;

  const product = await Product.findOne({ slug: req.params.slug });

  if (!product) {
    return next(new ErrorResponse("Product does not exist.", 400));
  } else {
    product.title = title;
    product.description = description;
    product.price = price;
    product.subs = subs;
    product.shipping = shipping;
    product.quantity = quantity;
    product.images = images;
    product.color = color;
    product.brand = brand;
    product.category = category;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  }
});

// // @desc Fetch all products without pagination
// // @route GET /api/products
// // @access Public
// export const listProducts = asyncHandler(async (req, res, next) => {
//   const { sort, order, limit } = req.body;

//   const products = await Product.find({})
//     .populate("category")
//     .populate("subs")
//     .sort([[sort, order]])
//     .limit(limit)
//     .exec();

//   res.json(products);
// });

// @desc Fetch all products
// @route GET /api/products
// @access Public
export const listProducts = asyncHandler(async (req, res, next) => {
  const { sort, order, page } = req.body;
  const currentPage = page || 1;
  const perPage = 4;

  const products = await Product.find({})
    .skip((currentPage - 1) * perPage)
    .populate("category")
    .populate("subs")
    .sort([[sort, order]])
    .limit(perPage)
    .exec();

  res.json(products);
});

// @desc Fetch all products for pagination
// @route GET /api/products/total
// @access Public
export const productsCount = asyncHandler(async (req, res, next) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
});

// @desc Create a new review
// @route POST /api/products/product/:id/reviews
// @access Private route
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const allreadyReviewed = product.reviews.find((r) =>
      r.user.toString() === req.user._id.toString()
    );

    if (allreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed", 400);
    }

    const review = {
      name: req.user.name,
      rating,
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) =>
      item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ msg: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Star product
// @route PUT /api/products/product/:id/star
// @access Public
export const productStar = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).exec();
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star } = req.body;

  let existingRatingObject = product.ratings.find((
    elem,
  ) => (elem.postedBy.toString() === user._id.toString()));

  if (existingRatingObject === undefined) {
    const ratingAdded = await Product.findByIdAndUpdate(product._id, {
      $push: { ratings: { star, postedBy: user._id } },
    }, {
      new: true,
    }).exec();
    res.status(201).json(ratingAdded);
  } else {
    const ratingUpdated = await Product.updateOne(
      { ratings: { $elemMatch: existingRatingObject } },
      { $set: { "ratings.$.star": star } },
      { new: true },
    ).exec();
    res.status(200).json(ratingUpdated);
  }
});

// @desc Fetch all related products
// @route PUT /api/products/product/:id/related
// @access Public
export const productsRelated = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).exec();

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(4)
    .populate("category")
    .populate("subs")
    .populate("postedBy")
    .exec();

  if (!related) {
    return next(new ErrorResponse("There is no related products.", 400));
  }

  res.status(200).json(related);
});

// @desc Filtering products by queries
// @route POST /api/products/search/filters
// @access Public
export const searchFilters = asyncHandler(async (req, res, next) => {
  const { query, price, category, stars, sub, shipping, brand, color } =
    req.body;

  if (query) {
    // console.log("query", query);
    await handleQuery(req, res, query);
  }

  if (price !== undefined) {
    // console.log("price", price);
    await handlePrice(req, res, price);
  }

  if (category) {
    // console.log("category", category);
    await handleCategory(req, res, category);
  }

  if (stars) {
    // console.log("stars", stars);
    await handleStar(req, res, stars);
  }

  if (sub) {
    // console.log("sub", sub);
    await handleSub(req, res, sub);
  }

  if (shipping) {
    console.log("shipping", shipping);
    await handleShipping(req, res, shipping);
  }

  if (color) {
    console.log("color", color);
    await handleColor(req, res, color);
  }

  if (brand) {
    console.log("brand", brand);
    await handleBrand(req, res, brand);
  }
});
