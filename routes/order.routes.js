import express from "express";
import { adminCheck, authCheck } from "../middlewares/auth.middleware.js";
import {
  createCashOrder,
  createOrder,
  getOrders,
  getOrdersAdmin,
  updateOrderStatus,
} from "../controllers/order.controllers.js";

const router = express.Router();

router.route("/")
  .post(authCheck, createOrder)
  .get(authCheck, getOrders);

router.route("/admin")
  .get(authCheck, adminCheck, getOrdersAdmin)
  .put(authCheck, adminCheck, updateOrderStatus);

router.route("/cod").post(authCheck, createCashOrder);

export default router;
