// routes/authSeller.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Seller from "../models/seller.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();
const otpStore = {}; // temporary OTP memory store

// ===================== SIGNUP (with OTP) =====================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, storeName, phone } = req.body;
    
    if (!name || !email || !password || !storeName) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    // Send OTP email
    try {
      await sendEmail(
        email,
        "Verify Your Seller Account - OTP",
        `Your OTP for email verification is: ${otp}\n\nThis OTP will expire in 10 minutes.`
      );
      console.log("✅ OTP sent to:", email);
    } catch (err) {
      console.error("❌ Email sending failed:", err);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    // Create seller (not verified yet)
    const seller = new Seller({
      name,
      email,
      storeName,
      phone: phone || "",
      password: hashedPassword,
      isVerified: false, // Mark as not verified
    });
    
    await seller.save();
    
    res.status(201).json({
      message: "Seller registered successfully. Check email for OTP.",
    });
  } catch (err) {
    console.error("❌ Seller Signup Error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// ===================== OTP Verification =====================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Check if OTP exists
    if (!otpStore[email]) {
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }

    // Check if OTP expired
    if (Date.now() > otpStore[email].expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    // Verify OTP
    if (otpStore[email].otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark seller as verified
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    seller.isVerified = true;
    await seller.save();

    // Delete OTP from store
    delete otpStore[email];

    // Generate token and log them in
    const token = jwt.sign(
      { id: seller._id, role: "seller" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Seller verified and logged in:", email);

    res.json({
      message: "Email verified successfully",
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        storeName: seller.storeName,
      },
    });
  } catch (err) {
    console.error("❌ OTP Verification Error:", err);
    res.status(500).json({ message: "Server error during verification" });
  }
});

// ===================== RESEND OTP =====================
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if seller exists
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    // Don't resend if already verified
    if (seller.isVerified) {
      return res.status(400).json({ message: "Email already verified. Please sign in." });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    // Send OTP email
    try {
      await sendEmail(
        email,
        "Your New OTP Code",
        `Your new OTP for email verification is: ${otp}\n\nThis OTP will expire in 10 minutes.`
      );
      console.log("✅ OTP resent to:", email);
    } catch (err) {
      console.error("❌ Email sending failed:", err);
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.json({ message: "New OTP sent to your email" });
  } catch (err) {
    console.error("❌ Resend OTP Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===================== LOGIN =====================
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if email is verified
    if (!seller.isVerified) {
      return res.status(403).json({ 
        message: "Please verify your email first. Check your inbox for OTP.",
        needsVerification: true 
      });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: seller._id, role: "seller" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Seller logged in:", email);

    res.json({
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        storeName: seller.storeName,
      },
    });
  } catch (err) {
    console.error("❌ Seller Signin Error:", err);
    res.status(500).json({ message: "Server error during signin" });
  }
});

// ===================== FORGOT PASSWORD =====================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found with that email" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetLink = `${process.env.CLIENT_URL}/reset-password/seller/${resetToken}`;

    seller.resetToken = resetToken;
    seller.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await seller.save();

    await sendEmail(
      email,
      "Vyaha Seller Password Reset",
      `Click here to reset your password: ${resetLink}\n\nThis link will expire in 15 minutes.`
    );

    console.log("✅ Password reset email sent to:", email);
    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ===================== RESET PASSWORD =====================
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    const seller = await Seller.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!seller) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashed = await bcrypt.hash(password, 10);
    seller.password = hashed;
    seller.resetToken = null;
    seller.resetTokenExpiry = null;
    await seller.save();

    console.log("✅ Password reset successful for:", seller.email);
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;