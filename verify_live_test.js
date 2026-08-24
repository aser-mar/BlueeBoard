const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const serverEnvPath = path.join(__dirname, 'Server', '.env');

dotenv.config({ path: serverEnvPath });

const User = require(path.join(__dirname, 'Server', 'models', 'User.js'));

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = `strictmode.verify.${Date.now().toString(36)}@example.com`;
    const payload = {
      name: 'StrictMode Test',
      email,
      password: 'Password@123',
    };

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    const user = await User.findOne({ email }).lean();

    console.log(JSON.stringify({
      status: response.status,
      responseBody: responseText,
      email,
      verificationToken: user && user.verificationToken ? user.verificationToken : null,
      expires: user && user.verificationTokenExpires ? user.verificationTokenExpires.toISOString() : null,
    }, null, 2));

    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
