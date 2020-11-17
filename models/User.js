import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  picture: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  role: {
    type: String,
    default: "user",
  },
  cart: {
    type: Array,
    default: [],
  },
  address: { type: String },
  city: { type: String },
  postalCode: { type: String },
  country: { type: String },
  wishlist: [{
    type: ObjectId,
    ref: "Product",
  }],
}, {
  timestamps: true,
});

const User = mongoose.model("User", UserSchema);
export default User;
