import express from "express";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

const router = express.Router();

// ✅ Get overall stats
router.get("/stats", async (req, res) => {
  try {
    const [productCount, userCount, sellerCount, orderCount] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "seller" }),
      Order.countDocuments(),
    ]);

    res.json({ productCount, userCount, sellerCount, orderCount });
  } catch (err) {
    console.error("❌ Error fetching stats:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// ✅ Delete product
router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete product" });
  }
});

// ✅ Get all sellers
router.get("/sellers", async (req, res) => {
  try {
    const sellers = await User.find({ role: "seller" }).select("-password");
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch sellers" });
  }
});

export default router;
