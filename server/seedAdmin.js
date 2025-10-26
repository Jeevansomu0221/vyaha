// server/seedAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📊 Connected to MongoDB");

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: "admin@vyahaweb.com" });
    if (existingAdmin) {
      console.log("✅ Admin already exists");
      process.exit(0);
    }

    // Create admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      name: "Admin",
      email: "admin@vyahaweb.com",
      password: hashedPassword,
      isAdmin: true, // ← Important!
    });

    await admin.save();
    console.log("✅ Admin created successfully");
    console.log("Email: admin@vyahaweb.com");
    console.log("Password: admin123");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

createAdmin();