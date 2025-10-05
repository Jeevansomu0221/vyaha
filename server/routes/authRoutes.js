import express from "express";
import { signup, verifyOTP, signin } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/signin", signin);
// In your authRoutes.js, add temporarily:
router.post("/test-signup", (req, res) => {
  console.log("Received data:", req.body);
  res.json({ 
    message: "Test successful!", 
    received: req.body 
  });
});
export default router;