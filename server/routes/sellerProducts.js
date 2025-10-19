import express from "express";
import Product from "../models/Product.js";
import authSeller from "../middleware/authSeller.js";

const router = express.Router();

// Seller submits a product
router.post("/products", authSeller, async (req, res) => {
  try {
    const { title, description, price, category, image, quantity } = req.body;
    
    const product = new Product({
      title,
      description,
      price,
      category,
      image, // base64 string
      quantity,
      seller: req.sellerId,
      status: "pending"
    });
    
    await product.save();
    
    // Populate seller info for response
    await product.populate('seller', 'name email phone storeName storeAddress city state pincode');
    
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
});

// Seller gets their products
router.get("/products", authSeller, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.sellerId })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching seller products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

export default router;