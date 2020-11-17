import express from "express";
import { adminCheck, authCheck } from "../middlewares/auth.middleware.js";
import {
  createCart,
  emptyCart,
  getCart,
  saveAddress,
} from "../controllers/cart.controllers.js";

const router = express.Router();

router.route("/")
  .post(authCheck, createCart)
  .get(authCheck, getCart)
  .delete(authCheck, emptyCart);

router.route("/address").post(authCheck, saveAddress);

export default router;
