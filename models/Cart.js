import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const CartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: ObjectId,
        ref: "Product",
      },
      count: Number,
      color: String,
      price: Number,
    },
  ],
  cartTotal: Number,
  totalAfterDiscount: Number,
  usedCoupon: {
    type: Boolean,
    default: false,
    required: true,
  },
  orderedBy: {
    type: ObjectId,
    ref: "User",
  },
}, {
  timestamps: true,
});

const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
