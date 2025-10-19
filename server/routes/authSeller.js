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
  const { name, email, password, storeName } = req.body;
  if (!name || !email || !password || !storeName)
    return res.status(400).json({ message: "All fields required" });

  const existingSeller = await Seller.findOne({ email });
  if (existingSeller)
    return res.status(400).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  try {
    await sendEmail(email, "OTP for Seller Signup", `Your OTP is ${otp}`);
  } catch (err) {
    console.error("❌ Email failed:", err);
  }

  const seller = new Seller({ name, email, storeName, password: hashedPassword });
  await seller.save();
  res.status(201).json({
    message: "Seller registered successfully. Check email for OTP.",
  });
});

// ===================== OTP Verification =====================
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!otpStore[email])
    return res.status(400).json({ message: "No OTP found for this email" });
  if (otpStore[email] !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  delete otpStore[email];
  res.json({ message: "OTP verified successfully" });
});

// ===================== LOGIN =====================
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const seller = await Seller.findOne({ email });
  if (!seller) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, seller.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: seller._id, role: "seller" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    seller: { id: seller._id, name: seller.name, email: seller.email },
  });
});

// ===================== FORGOT PASSWORD =====================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller)
      return res.status(404).json({ message: "Seller not found with that email" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetLink = `${process.env.CLIENT_URL}/reset-password/seller/${resetToken}`;

    seller.resetToken = resetToken;
    seller.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    await seller.save();

    await sendEmail(
      email,
      "Vyaha Seller Password Reset",
      `Click here to reset your password: ${resetLink}`
    );

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

    if (!seller)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashed = await bcrypt.hash(password, 10);
    seller.password = hashed;
    seller.resetToken = null;
    seller.resetTokenExpiry = null;
    await seller.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
