// middleware/authCustomer.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authCustomer = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // attach user to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = authCustomer;
