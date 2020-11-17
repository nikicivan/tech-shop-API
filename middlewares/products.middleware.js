import Product from "../models/Product.js";
import ErrorResponse from "../utils/errorResponse.js";
import asyncHandler from "./asyncHandler.js";

export const handleQuery = asyncHandler(async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category")
    .populate("subs")
    .populate("postedBy")
    .exec();

  res.status(200).json(products);
});

export const handlePrice = asyncHandler(async (req, res, price) => {
  const products = await Product.find(
    { price: { $gte: price[0], $lte: price[1] } },
  )
    .populate("category")
    .populate("subs")
    .populate("postedBy")
    .sort({ "price": "desc" })
    .exec();

  res.status(200).json(products);
});

export const handleCategory = asyncHandler(async (req, res, category) => {
  const products = await Product.find({ category })
    .populate("category")
    .populate("subs")
    .populate("postedBy")
    .sort({ "price": "desc" })
    .exec();

  res.status(200).json(products);
});

export const handleStar = asyncHandler((req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(20)
    .exec((err, aggregates) => {
      if (err) console.log("agregate error", err);
      Product.find({ _id: aggregates })
        .populate("category")
        .populate("subs")
        .populate("postedBy")
        .exec((err, products) => {
          if (err) console.log("Product agregate error", err);
          res.status(200).json(products);
        });
    });
});

export const handleSub = asyncHandler(async (req, res, sub) => {
  const products = await Product.find({ subs: sub })
    .populate("category")
    .populate("subs")
    .populate("postedBy")
    .exec();

  res.status(200).json(products);
});

export const handleShipping = asyncHandler(async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate("category")
    .populate("subs")
    .populate("postedBy")
    .exec();

  res.status(200).json(products);
});

export const handleColor = asyncHandler(async (req, res, color) => {
  const products = await Product.find({ color })
    .populate("category")
    .populate("subs")
    .populate("postedBy")
    .exec();

  res.status(200).json(products);
});

export const handleBrand = asyncHandler(async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate("category")
    .populate("subs")
    .populate("postedBy")
    .exec();

  res.status(200).json(products);
});
