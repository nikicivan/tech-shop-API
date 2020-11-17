import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import productRoutes from "./routes/product.routes.js";
import subRoutes from "./routes/sub.routes.js";
import imagesRoutes from "./routes/cloudinary.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import userRoutes from "./routes/user.routes.js";
import stripeRoutes from "./routes/stripe.routes.js";
import orderRoutes from "./routes/order.routes.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to the database
const mongodbUri =
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.osdil.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() =>
    console.log(
      "MongoDB Connected.".cyan.underline.bold,
    )
  )
  .catch((error) => console.log(error));

const app = express();

// Body parser
// app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));

// Dev loging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Sanitize data
app.use(mongoSanitize());

// Set security header
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000,
//   max: 100,
// });
// app.use(limiter);

// Prevent HTTP Param Polution
app.use(hpp());

// Enable CORS
app.use(cors({
  // origin: "https://tech-store-8bfb7.web.app",
  origin: "http://localhost:3000",
}));

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/sub", subRoutes);
app.use("/api/products", productRoutes);
app.use("/api/images", imagesRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API for TECH STORE");
});

app.listen(
  PORT,
  () =>
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
        .yellow.bold,
    ),
);

// // Handle unhandled promise rejections
// process.on("unhandledRejection", (err, promise) => {
//   console.log(`Error: ${err.message}`.red.bold);
//   // Close server & exit process
//   server.close(() => process.exit(1));
// });
