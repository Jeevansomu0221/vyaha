// server/routes/authAdmin.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /api/admin/auth/signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔐 Admin login attempt:", email);

    // Find admin user
    const admin = await User.findOne({ email });
    
    if (!admin) {
      console.log("❌ Admin not found:", email);
      return res.status(400).json({ message: "Admin not found" });
    }

    // Check if user is admin
    if (!admin.isAdmin) {
      console.log("❌ User is not admin:", email);
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("❌ Invalid password for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Admin logged in successfully:", email);

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("❌ Admin Signin Error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;