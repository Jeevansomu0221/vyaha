import express from "express";
import { signup, verifyOTP, signin } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/signin", signin);

export default router;
