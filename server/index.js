import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import sendEmail from "./utils/sendEmail.js";
import productRoutes from "./routes/productRoutes.js";
import sellerAuthRoutes from "./routes/authSeller.js";
import adminAuthRoutes from "./routes/authAdmin.js";
dotenv.config();

const app = express();

// Enhanced CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Remove array brackets
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

app.use(express.json());
connectDB();
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/seller", sellerAuthRoutes);
app.use("/api/products", productRoutes);

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