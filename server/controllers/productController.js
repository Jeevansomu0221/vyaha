// server/controllers/productController.js
import Product from "../models/Product.js";
import cloudinary from "../utils/cloudinary.js";

export const addProduct = async (req, res) => {
  try {
    const { title, description, price, category, image } = req.body;
    if (!title || !price || !image)
      return res.status(400).json({ message: "Missing fields" });

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "vyaha_products",
    });

    const product = new Product({
      title,
      description,
      price,
      category,
      image: uploadResult.secure_url,
      seller: req.sellerId,
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    console.error("❌ Add Product Error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
