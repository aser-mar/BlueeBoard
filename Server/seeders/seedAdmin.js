require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const ADMIN_NAME = process.env.ADMIN_NAME;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.log("❌ Missing admin credentials in .env");
  process.exit(1);
}

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB connected");

    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      ADMIN_PASSWORD,
      10
    );

    await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
    });

    console.log("🎉 Admin created successfully");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedAdmin();