import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const OrderSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: ObjectId,
        ref: "Product",
      },
      count: Number,
      color: String,
    },
  ],
  paymentIntent: {},
  orderStatus: {
    type: String,
    default: "Not Processed",
    enum: [
      "Not Processed",
      "Processing",
      "Dispatched",
      "Cancelled",
      "Completed",
      "Cash On Delivery",
    ],
  },
  orderedBy: {
    type: ObjectId,
    ref: "User",
  },
}, {
  timestamps: true,
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
