import express from "express";
import { adminCheck, authCheck } from "../middlewares/auth.middleware.js";
import {
  createOrUpdate,
  currentUser,
} from "../controllers/auth.controllers.js";

const router = express.Router();

router.route("/createorupdateuser")
  .post(authCheck, createOrUpdate)
  .get(authCheck, createOrUpdate);

router.route("/current-user").post(authCheck, currentUser);
router.route("/current-admin").post(authCheck, adminCheck, currentUser);

export default router;
