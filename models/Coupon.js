import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const CouponSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    uppercase: true,
    required: [true, "Please, add coupon name"],
    minlength: [6, "To short"],
    maxlength: [12, "To long"],
  },
  expired: {
    type: Date,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const Coupon = mongoose.model("Coupon", CouponSchema);
export default Coupon;
