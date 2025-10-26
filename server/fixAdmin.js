// server/fixAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const fixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📊 Connected to MongoDB");

    // Find the admin user
    const admin = await User.findOne({ email: "admin@vyahaweb.com" });
    
    if (!admin) {
      console.log("❌ Admin user not found!");
      console.log("Run: node server/seedAdmin.js");
      process.exit(1);
    }

    console.log("Found admin user:");
    console.log("  Name:", admin.name);
    console.log("  Email:", admin.email);
    console.log("  isAdmin:", admin.isAdmin);

    if (!admin.isAdmin) {
      admin.isAdmin = true;
      await admin.save();
      console.log("✅ Updated admin.isAdmin to true");
    } else {
      console.log("✅ Admin already has isAdmin: true");
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

fixAdmin();