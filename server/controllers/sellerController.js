import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Seller from "../models/seller.js";
import sendEmail from "../utils/sendEmail.js";

// --------------------- SIGNUP ---------------------
export const sellerSignup = async (req, res) => {
  try {
    const { name, email, password, storeName } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller)
      return res.status(400).json({ message: "Seller already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    const seller = new Seller({
      name,
      email,
      storeName,
      password: hashedPassword,
      otp,
    });
    await seller.save();

    // Send OTP email
    await sendEmail(
      email,
      "VyahaWeb Seller OTP Verification",
      `Hello ${name},\n\nYour OTP code is: ${otp}\n\nThank you!`
    );

    res.status(201).json({
      message: "Seller registered successfully. Check your email for OTP.",
    });
  } catch (err) {
    console.error("❌ Seller Signup Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --------------------- VERIFY OTP ---------------------
export const verifySellerOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(400).json({ message: "Seller not found" });

    if (seller.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    seller.isVerified = true;
    seller.otp = null; // clear OTP after verification
    await seller.save();

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error("❌ OTP Verification Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --------------------- SIGNIN ---------------------
export const sellerSignin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(400).json({ message: "Invalid credentials" });
    if (!seller.isVerified)
      return res.status(400).json({ message: "Email not verified" });

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
  } catch (err) {
    console.error("❌ Seller Signin Error:", err);
    res.status(500).json({ message: err.message });
  }
};
