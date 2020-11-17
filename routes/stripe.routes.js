import express from "express";
import { authCheck } from "../middlewares/auth.middleware.js";
import { createPaymentIntent } from "../controllers/stripe.controllers.js";

const router = express.Router();

router.route("/create-payment-intent").post(authCheck, createPaymentIntent);

export default router;
