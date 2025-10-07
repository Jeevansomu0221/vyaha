// server/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import generateOTP from "../utils/generateOTP.js";

// ====================== SIGNUP ======================
export const signup = async (req, res) => {
  try {
    console.log("📥 Signup request received:", { 
      name: req.body.name, 
      email: req.body.email,
      password: "***" 
    });

    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password and generate OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    console.log("🔢 Generated OTP:", otp);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "customer",
      otp,
      otpExpiry: Date.now() + 10 * 60 * 1000, // 10 mins
      verified: false,
    });

    await user.save();
    console.log("✅ User saved to database");

    // Send OTP email
    try {
      await sendEmail(
        email,
        "Verify your VyahaWeb account",
        `Your OTP code is ${otp}. It will expire in 10 minutes.`
      );
      console.log("✅ Email sent successfully to", email);
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      // Don't return error here - user is created, just email failed
      console.log("⚠️ User created but email failed");
    }

    res.status(201).json({ 
      success: true,
      message: "OTP sent to email. Please verify." 
    });
  } catch (err) {
    console.error("❌ SIGNUP ERROR:", err);
    res.status(500).json({ 
      success: false,
      message: "Internal server error during signup",
      error: err.message 
    });
  }
};

// ====================== VERIFY OTP ======================
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
    console.error("❌ VERIFY OTP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ====================== SIGNIN ======================
export const signin = async (req, res) => {  // Make sure it's lowercase 'signin'
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
    console.error("❌ SIGNIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Explicit exports to ensure they're available
export default { signup, verifyOTP, signin };