import express from "express";
import { adminCheck, authCheck } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  getCategory,
  getSubs,
  listCategories,
  removeCategory,
  updateCategory,
} from "../controllers/category.controllers.js";

const router = express.Router();

router.route("/subs/:id").get(getSubs);

router.route("/")
  .post(authCheck, adminCheck, createCategory)
  .get(listCategories);

router.route("/:slug")
  .get(getCategory)
  .delete(authCheck, adminCheck, removeCategory)
  .put(authCheck, adminCheck, updateCategory);

export default router;
