import express from "express";
import Product from "../models/Product.js";
import authAdmin from "../middleware/authAdmin.js";// Changed to named import

const router = express.Router();

// Get all pending products with seller info
router.get("/pending", authAdmin, async (req, res) => {
  try {
    const products = await Product.find({ status: "pending" })
      .populate("seller", "name email phone storeName storeAddress city state pincode")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching pending products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Test route
router.get("/test", async (req, res) => {
  try {
    const testProduct = new Product({
      title: "Test Product",
      description: "This is a test product",
      price: 99.99,
      category: "Electronics",
      image: "test-image.jpg",
      quantity: 10,
      status: "pending"
    });
    await testProduct.save();
    res.json({ message: "Test product created", product: testProduct });
  } catch (error) {
    res.status(500).json({ message: "Test failed", error: error.message });
  }
});

// Approve a product
router.put("/:id/approve", authAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      { status: "approved" }, 
      { new: true }
    ).populate("seller", "name email phone storeName storeAddress city state pincode");
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({ success: true, product });
  } catch (err) {
    console.error("Error approving product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reject a product
router.put("/:id/reject", authAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      { status: "rejected" }, 
      { new: true }
    ).populate("seller", "name email phone storeName storeAddress city state pincode");
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json({ success: true, product });
  } catch (err) {
    console.error("Error rejecting product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all products (for admin)
router.get("/", authAdmin, async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "name email")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// Delete product
router.delete("/:id", authAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;