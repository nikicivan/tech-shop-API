import express from "express";
import { adminCheck, authCheck } from "../middlewares/auth.middleware.js";
import {
  applyCouponToUserCart,
  createCoupon,
  listCoupons,
  removeCoupon,
} from "../controllers/coupon.controllers.js";

const router = express.Router();

router.route("/")
  .post(authCheck, adminCheck, createCoupon)
  .get(authCheck, adminCheck, listCoupons);

router.route("/:id").delete(authCheck, adminCheck, removeCoupon);

router.route("/user/cart").post(authCheck, applyCouponToUserCart);

export default router;
