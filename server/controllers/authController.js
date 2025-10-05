// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import generateOTP from "../utils/generateOTP.js";
import { sendEmail } from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  try {
    console.log("📥 Signup request received:", { 
      name: req.body.name, 
      email: req.body.email,
      password: "***" 
    });

    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = generateOTP();
    console.log("🔢 Generated OTP:", otp);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000, // 10 minutes
      verified: false,
    });

    await user.save();
    console.log("✅ User saved to database");

    // TEMPORARY FIX: Comment out email sending for now
    console.log("📧 [TEMPORARY] OTP would be sent to:", email);
    console.log("📧 [TEMPORARY] OTP:", otp);
    
    /*
    // Uncomment this when email is working
    try {
      await sendEmail(email, "Verify your VyahaWeb account", `Your OTP verification code is: ${otp}`);
      console.log("✅ Email sent successfully");
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      // Delete the user if email fails? Or proceed?
      // await User.findByIdAndDelete(user._id);
      // return res.status(500).json({ message: "Failed to send verification email" });
    }
    */

    res.json({ 
      message: "OTP sent to email. Please verify.",
      debug_otp: otp // Remove this in production
    });
    
  } catch (err) {
    console.error("❌ SIGNUP ERROR:", err);
    res.status(500).json({ 
      message: "Internal server error during signup",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Keep your verifyOTP and signin functions as they were
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.verified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Account verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.verified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};