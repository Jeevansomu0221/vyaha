import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Import all route files
import authRoutes from "./routes/authRoutes.js";
import sellerAuthRoutes from "./routes/authSeller.js";
import adminAuthRoutes from "./routes/authAdmin.js";
import productRoutes from "./routes/productRoutes.js";
import sellerProfileRoutes from "./routes/sellerProfile.js";
import adminProductRoutes from "./routes/adminProducts.js";
import sellerProductRoutes from "./routes/sellerProducts.js";
import adminRoutes from "./routes/admin.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

// For ES modules __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enhanced CORS configuration - Allow frontend ports
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" 
      ? process.env.CLIENT_URL 
      : ["http://localhost:5173", "http://localhost:5174"], 
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Logging middleware
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Connect to MongoDB
connectDB();

// ------------------------
// API ROUTES
// ------------------------

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/seller/auth", sellerAuthRoutes);
app.use("/api/admin/auth", adminAuthRoutes);

// Product routes for customers (PUBLIC - only approved products)
app.use("/api/products", productRoutes);

// Seller routes (PROTECTED - seller authentication required)
app.use("/api/seller/profile", sellerProfileRoutes);
app.use("/api/seller/products", sellerProductRoutes);

// Admin routes (PROTECTED - admin authentication required)
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin", adminRoutes);

// Cart & Order routes
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// ------------------------
// DEBUG / TEST ROUTES
// ------------------------

// Debug all products
app.get("/api/debug/all-products", async (req, res) => {
  try {
    const Product = (await import("./models/Product.js")).default;
    const products = await Product.find()
      .populate("seller", "name email storeName")
      .sort({ createdAt: -1 });

    console.log("📊 All products in database:");
    products.forEach(p => {
      console.log(`- ${p.title} | Status: ${p.status} | Seller: ${p.seller?.name || p.seller?.storeName}`);
    });

    res.json({
      total: products.length,
      approved: products.filter(p => p.status === "approved").length,
      pending: products.filter(p => p.status === "pending").length,
      rejected: products.filter(p => p.status === "rejected").length,
      products: products.map(p => ({
        id: p._id,
        title: p.title,
        status: p.status,
        price: p.price,
        seller: p.seller?.name || p.seller?.storeName,
        sellerEmail: p.seller?.email,
        createdAt: p.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Debug failed", error: error.message });
  }
});

// Debug pending products
app.get("/api/debug/pending-products", async (req, res) => {
  try {
    const Product = (await import("./models/Product.js")).default;
    const pendingProducts = await Product.find({ status: "pending" })
      .populate("seller", "name email storeName");

    console.log("📦 Pending products in DB:", pendingProducts.length);

    res.json({
      totalPending: pendingProducts.length,
      products: pendingProducts
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending products", error: error.message });
  }
});

// Debug approved products
app.get("/api/debug/approved-products", async (req, res) => {
  try {
    const Product = (await import("./models/Product.js")).default;
    const approvedProducts = await Product.find({ status: "approved" })
      .populate("seller", "name email storeName");

    console.log("✅ Approved products in DB:", approvedProducts.length);

    res.json({
      totalApproved: approvedProducts.length,
      products: approvedProducts
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch approved products", error: error.message });
  }
});

// Test admin authentication
app.get("/api/debug/test-admin-auth", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.json({ 
      authenticated: false, 
      message: "No token provided",
      hint: "Add Authorization: Bearer <token> header"
    });
  }

  try {
    const jwt = (await import("jsonwebtoken")).default;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const User = (await import("./models/User.js")).default;
    const user = await User.findById(decoded.id);
    
    res.json({
      authenticated: true,
      isAdmin: user?.isAdmin || false,
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.isAdmin ? "admin" : "customer"
      }
    });
  } catch (error) {
    res.json({
      authenticated: false,
      error: error.message
    });
  }
});

// Test seller authentication
app.get("/api/debug/test-seller-auth", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.json({ 
      authenticated: false, 
      message: "No token provided",
      hint: "Add Authorization: Bearer <token> header"
    });
  }

  try {
    const jwt = (await import("jsonwebtoken")).default;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== "seller") {
      return res.json({
        authenticated: false,
        message: "Token is not for a seller account"
      });
    }

    const Seller = (await import("../models/Seller.js")).default;
    const seller = await Seller.findById(decoded.id);
    
    res.json({
      authenticated: true,
      isSeller: true,
      seller: {
        id: seller?._id,
        name: seller?.name,
        email: seller?.email,
        storeName: seller?.storeName
      }
    });
  } catch (error) {
    res.json({
      authenticated: false,
      error: error.message
    });
  }
});

// Test email
app.get("/api/test-email", async (req, res) => {
  try {
    const testEmail = "jeevansomu.ch@gmail.com";
    console.log("🔄 Testing email to:", testEmail);

    const { default: sendEmail } = await import("./utils/sendEmail.js");
    await sendEmail(
      testEmail,
      "VyahaWeb Test Email",
      "This is a test email from your server!"
    );

    console.log("✅ Test email sent successfully");
    res.json({ success: true, message: "Test email sent to " + testEmail });
  } catch (error) {
    console.error("❌ Test email failed:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      note: "Check EMAIL_USER and EMAIL_PASS in .env"
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development"
  });
});

// ------------------------
// SERVE REACT APP IN PRODUCTION
// ------------------------

if (process.env.NODE_ENV === "production") {
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, "../client/dist")));
  
  // Handle React routing - return index.html for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

// ------------------------
// ERROR HANDLING
// ------------------------

// 404 handler (only in development, production uses React router)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res) => {
    res.status(404).json({
      message: "Route not found",
      path: req.path,
      method: req.method
    });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

// ------------------------
// SERVER START
// ------------------------
const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log("=====================================");
  console.log(`✅ Server running on: http://localhost:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`✅ API base URL: http://localhost:${PORT}/api`);
  console.log("=====================================");
  console.log("📋 Available Routes:");
  console.log("  Auth:");
  console.log("    - POST /api/auth/customer/signup");
  console.log("    - POST /api/auth/customer/signin");
  console.log("    - POST /api/seller/auth/signup");
  console.log("    - POST /api/seller/auth/signin");
  console.log("    - POST /api/admin/auth/signin");
  console.log("  Products:");
  console.log("    - GET /api/products (public - approved only)");
  console.log("    - GET /api/products/:id (public - approved only)");
  console.log("  Seller:");
  console.log("    - POST /api/seller/products (add product)");
  console.log("    - GET /api/seller/products (view all own products)");
  console.log("  Admin:");
  console.log("    - GET /api/admin/products/pending");
  console.log("    - PUT /api/admin/products/:id/status");
  console.log("  Debug:");
  console.log("    - GET /api/debug/all-products");
  console.log("    - GET /api/debug/pending-products");
  console.log("    - GET /api/debug/approved-products");
  console.log("    - GET /api/debug/test-admin-auth");
  console.log("    - GET /api/debug/test-seller-auth");
  console.log("=====================================");
  
  if (process.env.NODE_ENV === "production") {
    console.log("🌐 Serving React app from /client/dist");
  }
});