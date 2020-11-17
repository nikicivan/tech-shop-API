import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
import slugify from "slugify";

const SubSchema = new mongoose.Schema({
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
  parent: {
    type: ObjectId,
    ref: "Category",
    required: true,
  },
}, {
  timestamps: true,
});

// Create sub slug from the name
SubSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Sub = mongoose.model("Sub", SubSchema);
export default Sub;
