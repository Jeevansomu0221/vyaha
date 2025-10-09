// server/routes/productRoutes.js
import express from "express";
import { addProduct, getAllProducts } from "../controllers/productController.js";
import authSeller from "../middleware/authSeller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/add", authSeller, addProduct);

export default router;
