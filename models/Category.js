import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
import slugify from "slugify";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required."],
    minlength: [1, "Too short."],
    maxlength: [32, "Too long"],
  },
  slug: {
    type: String,
    unique: true,
  },
}, {
  timestamps: true,
});

// Create category slug from the name
CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Category = mongoose.model("Category", CategorySchema);
export default Category;
