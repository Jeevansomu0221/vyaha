import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import sendEmail from "./utils/sendEmail.js";
import productRoutes from "./routes/productRoutes.js";
import sellerAuthRoutes from "./routes/authSeller.js";
import sellerProfileRoutes from "./routes/sellerProfile.js";
import adminAuthRoutes from "./routes/authAdmin.js";
import adminProductRoutes from "./routes/adminProducts.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import sellerProductRoutes from "./routes/sellerProducts.js";

dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Add this before your routes in server/index.js
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path}`);
  next();
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/seller", sellerAuthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/seller", sellerProfileRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/seller", sellerProductRoutes);

// Debug route to check all products
app.get("/api/debug/products", async (req, res) => {
  try {
    const Product = (await import("./models/Product.js")).default;
    const products = await Product.find().populate("seller", "name email");
    res.json({
      total: products.length,
      products: products
    });
  } catch (error) {
    res.status(500).json({ message: "Debug failed", error: error.message });
  }
});

// Change from POST to GET for easier testing
app.get("/api/test-email", async (req, res) => {
  try {
    const testEmail = "jeevansomu.ch@gmail.com"; // Your email
    console.log("🔄 Testing email to:", testEmail);
    
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

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log("=====================================");
  console.log(`✅ Server running on: http://localhost:${PORT}`);
  console.log(`✅ API base URL: http://localhost:${PORT}/api`);
  console.log("=====================================");
});