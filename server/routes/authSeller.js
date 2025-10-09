// routes/authSeller.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Seller from "../models/seller.js";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();
const otpStore = {};

// Signup with OTP
router.post("/signup", async (req, res) => {
  const { name, email, password, storeName } = req.body;
  if (!name || !email || !password || !storeName)
    return res.status(400).json({ message: "All fields required" });

  const existingSeller = await Seller.findOne({ email });
  if (existingSeller) return res.status(400).json({ message: "Email exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  try {
    await sendEmail(email, "OTP for Seller Signup", `Your OTP is ${otp}`);
  } catch (err) {
    console.error("Email failed:", err);
  }

  const seller = new Seller({ name, email, storeName, password: hashedPassword });
  await seller.save();
  res.status(201).json({ message: "Seller registered successfully. Check email for OTP." });
});

// OTP Verification
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!otpStore[email]) return res.status(400).json({ message: "No OTP found" });
  if (otpStore[email] !== otp) return res.status(400).json({ message: "Invalid OTP" });

  delete otpStore[email];
  res.json({ message: "OTP verified successfully" });
});

// Login
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const seller = await Seller.findOne({ email });
  if (!seller) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, seller.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: seller._id, role: "seller" }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, seller: { id: seller._id, name: seller.name, email: seller.email } });
});

export default router;
