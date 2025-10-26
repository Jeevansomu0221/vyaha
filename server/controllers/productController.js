// server/controllers/productController.js
import Product from "../models/Product.js";

// ✅ GET all APPROVED products (for customer-facing site)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "approved" })
      .populate("seller", "storeName name email")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("❌ Get All Products Error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// ✅ GET single APPROVED product by ID (for product details page)
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      _id: req.params.id, 
      status: "approved" 
    }).populate("seller", "storeName name email");

    if (!product) {
      return res.status(404).json({ message: "Product not found or not approved" });
    }

    res.json(product);
  } catch (err) {
    console.error("❌ Get Product By ID Error:", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

// ✅ GET seller's own products (ALL statuses - for seller dashboard)
export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.sellerId })
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (err) {
    console.error("❌ Get Seller Products Error:", err);
    res.status(500).json({ message: "Failed to fetch seller products" });
  }
};

// ✅ Seller adds a new product (status defaults to "pending")
export const addProduct = async (req, res) => {
  try {
    const { title, description, price, category, image, quantity } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required" });
    }

    const product = new Product({
      title,
      description,
      price,
      category,
      image,
      quantity: quantity || 1,
      seller: req.sellerId, // populated by authSeller middleware
      status: "pending", // 🔴 Default status
    });

    await product.save();
    
    res.status(201).json({ 
      message: "Product submitted for admin approval", 
      product 
    });
  } catch (err) {
    console.error("❌ Add Product Error:", err);
    res.status(500).json({ message: "Failed to add product" });
  }
};

// ✅ Seller updates their own product (only if pending or rejected)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ _id: id, seller: req.sellerId });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prevent editing approved products
    if (product.status === "approved") {
      return res.status(403).json({ 
        message: "Cannot edit approved products. Please contact admin." 
      });
    }

    const updates = req.body;
    Object.assign(product, updates);
    product.status = "pending"; // Reset to pending after edit

    await product.save();
    res.json({ message: "Product updated and resubmitted for approval", product });
  } catch (err) {
    console.error("❌ Update Product Error:", err);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// ✅ Seller deletes their own product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ 
      _id: id, 
      seller: req.sellerId 
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Product Error:", err);
    res.status(500).json({ message: "Failed to delete product" });
  }
};