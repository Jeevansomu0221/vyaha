// server/routes/sellerProducts.js - Simple version without Cloudinary
import express from "express";
import multer from "multer";
import Product from "../models/Product.js";
import authSeller from "../middleware/authSeller.js";

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// GET /api/seller/products - Get seller's own products
router.get("/", authSeller, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.sellerId })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("❌ Get Seller Products Error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// POST /api/seller/products - Add new product with images (base64)
router.post("/", authSeller, upload.array("images", 10), async (req, res) => {
  try {
    const { title, description, price, category, quantity } = req.body;

    console.log("📦 Received product data:", { title, price, category, quantity });
    console.log("📷 Received files:", req.files?.length || 0);

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    // Convert images to base64
    const imageUrls = req.files.map((file) => {
      const base64 = file.buffer.toString('base64');
      return `data:${file.mimetype};base64,${base64}`;
    });

    console.log(`✅ Converted ${imageUrls.length} images to base64`);

    // Create product
    const product = new Product({
      title,
      description: description || "",
      price: Number(price),
      category: category || "",
      quantity: Number(quantity) || 1,
      image: imageUrls[0], // Main image (first one)
      images: imageUrls, // All images
      seller: req.sellerId,
      status: "pending",
    });

    await product.save();
    console.log(`✅ Product created: ${title} by seller ${req.sellerId}`);

    res.status(201).json({
      message: "Product submitted for admin approval",
      product,
    });
  } catch (err) {
    console.error("❌ Add Product Error:", err);
    console.error("Error details:", err.message);
    res.status(500).json({ 
      message: "Failed to add product",
      error: err.message 
    });
  }
});

// DELETE /api/seller/products/:id - Delete product
router.delete("/:id", authSeller, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({
      _id: id,
      seller: req.sellerId,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(`✅ Product deleted: ${product.title}`);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Product Error:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
});

export default router;