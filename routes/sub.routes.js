import express from "express";
import { adminCheck, authCheck } from "../middlewares/auth.middleware.js";
import {
  createSub,
  getSub,
  listSub,
  removeSub,
  updateSub,
} from "../controllers/sub.controllers.js";

const router = express.Router();

router.route("/")
  .get(listSub)
  .post(authCheck, adminCheck, createSub);

router.route("/:slug")
  .get(getSub)
  .put(authCheck, adminCheck, updateSub)
  .delete(authCheck, adminCheck, removeSub);

export default router;
