import express from "express";
import { authCheck } from "../middlewares/auth.middleware.js";
import {
  addToWishlist,
  getWishlist,
  removeWishlist,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.route("/wishlist")
  .get(authCheck, getWishlist)
  .post(authCheck, addToWishlist)
  .put(authCheck, removeWishlist);

export default router;
