import express from "express";
import Product from "../models/Product.js";
import authAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// GET /api/admin/products/pending
router.get("/pending", authAdmin, async (req, res) => {
  try {
    const pendingProducts = await Product.find({ status: "pending" })
      .populate("seller", "name email storeName");
    res.json(pendingProducts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pending products" });
  }
});

// PUT /api/admin/products/:id/status
router.put("/:id/status", authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const product = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product status" });
  }
});

export default router;