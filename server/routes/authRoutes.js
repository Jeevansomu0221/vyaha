import express from "express";
import { sellerSignup, sellerSignin, verifySellerOTP } from "../controllers/sellerController.js";

const router = express.Router();

router.post("/signup", sellerSignup);
router.post("/verify-otp", verifySellerOTP);
router.post("/signin", sellerSignin);

export default router;
