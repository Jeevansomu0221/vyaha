// server/routes/authSeller.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller");
const bcrypt = require("bcryptjs");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(400).json({ message: "Seller not found" });

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: seller._id, role: "seller" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
