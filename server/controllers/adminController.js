// server/controllers/adminController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // assuming admins are stored in User collection
import Product from "../models/Product.js";

export const adminSignin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin user
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error("❌ Admin Signin Error:", err);
    res.status(500).json({ message: err.message });
  }
};
export const getPendingProducts = async (req, res) => {
    try {
        // Find all products with the status "pending"
        const pendingProducts = await Product.find({ status: "pending" })
            .populate("seller", "storeName email") // Optionally get seller info
            .sort({ createdAt: 1 }); // Oldest first

        res.json(pendingProducts);
    } catch (err) {
        console.error("❌ Get Pending Products Error:", err);
        res.status(500).json({ message: "Failed to fetch pending products" });
    }
};

// --------------------- APPROVE/REJECT PRODUCT ---------------------
export const updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expecting 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.status = status;
        await product.save();

        // Optional: Add logic here to notify the seller (using sendEmail)

        res.json({ message: `Product ${status} successfully`, product });
    } catch (err) {
        console.error("❌ Update Product Status Error:", err);
        res.status(500).json({ message: "Failed to update product status" });
    }
};