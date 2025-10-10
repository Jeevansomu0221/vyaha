// server/controllers/adminController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // assuming admins are stored in User collection

export const adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin user
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error("❌ Admin Signin Error:", err);
    res.status(500).json({ message: err.message });
  }
};
