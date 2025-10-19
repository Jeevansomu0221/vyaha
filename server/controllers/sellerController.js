import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Seller from "../models/seller.js";
import sendEmail from "../utils/sendEmail.js";

// --------------------- SIGNUP ---------------------
export const sellerSignup = async (req, res) => {
  try {
    const { name, email, password, storeName } = req.body;
    if (!name || !email || !password || !storeName)
      return res.status(400).json({ message: "All fields are required" });

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller)
      return res.status(400).json({ message: "Seller already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(100000, 999999).toString();

    const seller = new Seller({
      name,
      email,
      storeName,
      password: hashedPassword,
      otp,
    });
    await seller.save();

    await sendEmail(
      email,
      "Vyaha Seller OTP Verification",
      `Hello ${name},\n\nYour OTP is: ${otp}\n\nTeam Vyaha`
    );

    res.status(201).json({
      message: "Seller registered successfully. Please verify your email using OTP.",
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
    seller.otp = null;
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

// --------------------- FORGOT PASSWORD ---------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(404).json({ message: "Seller not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetLink = `${process.env.CLIENT_URL}/reset-password/seller/${resetToken}`;

    seller.resetToken = resetToken;
    seller.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min
    await seller.save();

    await sendEmail(
      email,
      "Vyaha Seller Password Reset",
      `Click here to reset your password:\n${resetLink}\n\nThis link expires in 15 minutes.`
    );

    res.json({ message: "Password reset link sent to your email" });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --------------------- RESET PASSWORD ---------------------
export const resetPassword = async (req, res) => {
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

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    res.status(500).json({ message: err.message });
  }
};
// --------------------- GET SELLER PROFILE ---------------------
export const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.sellerId).select("-password -otp");
    if (!seller) return res.status(404).json({ message: "Seller not found" });
    res.json({ data: seller });
  } catch (err) {
    console.error("❌ Get Seller Profile Error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// --------------------- UPDATE SELLER PROFILE ---------------------
export const updateSellerProfile = async (req, res) => {
  try {
    const updatedSeller = await Seller.findByIdAndUpdate(req.sellerId, req.body, {
      new: true,
    }).select("-password -otp");
    if (!updatedSeller) return res.status(404).json({ message: "Seller not found" });
    res.json({ data: updatedSeller });
  } catch (err) {
    console.error("❌ Update Seller Profile Error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
