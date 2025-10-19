import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🧩 Middleware to verify seller token
const authSeller = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.sellerId = decoded.id;
    next();
  } catch {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ Get seller profile
router.get("/profile", authSeller, async (req, res) => {
  try {
    const seller = await User.findById(req.sellerId).select("-password");
    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// ✅ Update seller profile
router.put("/profile", authSeller, async (req, res) => {
  try {
    const update = req.body;
    const seller = await User.findByIdAndUpdate(req.sellerId, update, { new: true }).select("-password");
    res.json({ success: true, seller });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;
