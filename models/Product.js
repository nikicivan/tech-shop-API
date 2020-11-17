import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
import slugify from "slugify";

const reviewsSchema = mongoose.Schema({
  name: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: String,
  user: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please, add product title"],
    maxlength: 320,
    text: true,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  description: {
    type: String,
    required: [true, "Please, add a description"],
    maxlength: 2000,
    text: true,
  },
  price: {
    type: Number,
    required: true,
    trim: true,
    maxlength: 32,
  },
  category: {
    type: ObjectId,
    ref: "Category",
  },
  subs: [
    {
      type: ObjectId,
      ref: "Sub",
    },
  ],
  quantity: Number,
  sold: {
    type: Number,
    default: 0,
  },
  images: {
    type: Array,
  },
  shipping: {
    type: String,
    enum: ["Yes", "No"],
  },
  color: {
    type: String,
    enum: ["Black", "Brown", "Silver", "White", "Blue"],
  },
  brand: {
    type: String,
    enum: ["Apple", "Lenovo", "HP", "Samsung", "Microsoft", "Beko", "Gorenje"],
  },
  reviews: [reviewsSchema],
  ratings: [{
    star: Number,
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  }],
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
  timestamps: true,
});

// Create product slug from the name
ProductSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Product = mongoose.model("Product", ProductSchema);
export default Product;
