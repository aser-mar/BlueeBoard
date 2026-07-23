require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const cors = require("cors");
const companyRoutes = require("./routes/companyRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const companyManagerRoutes = require("./routes/companyManagerRoutes");
const companyManagerProductRoutes = require("./routes/companyManagerProductRoutes");
const helmet = require("helmet");
const {apiLimiter,} = require("./middleware/rateLimiter");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
app.set('trust proxy', 1);
console.log("CLIENT_URL =", process.env.CLIENT_URL);
const corsOptions = {
  origin: ["https://blueeboard.com", "https://www.blueeboard.com"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);  

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(mongoSanitize());

app.use(apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/company-managers", companyManagerRoutes);
app.use("/api/company-manager/products",companyManagerProductRoutes);
// middleware to parse URL-encoded data
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});



module.exports = app;