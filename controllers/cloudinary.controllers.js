import asyncHandler from "../middlewares/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

// Load env vars
dotenv.config({ path: "./config/config.env" });

// config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc Upload images on cloudinary
// @route POST /api/images
// @access Private/Admin
export const uploadImages = asyncHandler(async (req, res) => {
  let result = await cloudinary.uploader.upload(req.body.image, {
    public_id: `${Date.now()}`,
    resource_type: "auto",
  });
  res.json({
    public_id: result.public_id,
    url: result.secure_url,
  });
});

// @desc Remove images on cloudinary
// @route DELETE /api/images
// @access Private/Admin
export const removeImages = asyncHandler((req, res) => {
  let image_id = req.body.public_id;
  cloudinary.uploader.destroy(image_id, (error, result) => {
    if (error) {
      return res.json({ success: false, error });
    }
    res.status(200).json(result);
  });
});
