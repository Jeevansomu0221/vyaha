import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

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

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log("=====================================");
  console.log(`✅ Server running on: http://localhost:${PORT}`);
  console.log(`✅ API base URL: http://localhost:${PORT}/api`);
  console.log("=====================================");
});