import express from "express";
import Product from "../models/Product.js";
import authSeller from "../middleware/authSeller.js";

const router = express.Router();

// Seller submits a product
router.post("/products", authSeller, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      seller: req.sellerId // from auth middleware
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
});

// Seller gets their products
router.get("/products", authSeller, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.sellerId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

export default router;