import express from "express";
import { adminCheck, authCheck } from "../middlewares/auth.middleware.js";
import {
  removeImages,
  uploadImages,
} from "../controllers/cloudinary.controllers.js";

const router = express.Router();

router.route("/uploadimages")
  .post(authCheck, adminCheck, uploadImages);

router.route("/removeimage").post(authCheck, adminCheck, removeImages);

export default router;
