const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "d:/BlueeBoard/Server/.env" });
const User = require("d:/BlueeBoard/Server/models/User.js");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = `strictmode.verify.${Date.now().toString(36)}@example.com`;
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "StrictMode Test", email, password: "Password@123" }),
    });
    const body = await response.text();
    const user = await User.findOne({ email }).lean();
    console.log(JSON.stringify({ status: response.status, body, email, verificationToken: user && user.verificationToken ? user.verificationToken : null }, null, 2));
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
