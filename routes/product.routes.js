import express from "express";
import { adminCheck, authCheck } from "../middlewares/auth.middleware.js";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getProductBySlug,
  getProducts,
  listProducts,
  productsCount,
  productsRelated,
  productStar,
  searchFilters,
  updateProductBySlug,
} from "../controllers/product.controllers.js";

const router = express.Router();

router.route("/")
  .post(listProducts)
  .get(productsCount);

router.route("/:count")
  .get(getProducts);

router.route("/product")
  .post(authCheck, adminCheck, createProduct);

router.route("/product/:id/related").get(productsRelated);

router.route("/product/:slug")
  .get(getProductBySlug)
  .delete(authCheck, adminCheck, deleteProduct)
  .put(authCheck, adminCheck, updateProductBySlug);

// router.route("/product/:id/reviews").post(authCheck, createProductReview);
router.route("/product/:id/star").put(authCheck, productStar);

// search
router.route("/search/filters").post(searchFilters);

export default router;
