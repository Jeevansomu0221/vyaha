// server/middleware/authCustomer.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authCustomer = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No authentication token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user to request
    req.userId = user._id;
    req.user = user;
    
    next();
  } catch (err) {
    console.error("❌ Auth Customer Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authCustomer;