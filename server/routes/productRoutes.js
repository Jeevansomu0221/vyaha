// server/routes/productRoutes.js

import express from "express";
// 👇 CORRECT: Import the function from the controller
import { 
    getAllProducts, 
    getProductById 
} from "../controllers/productController.js"; 

const router = express.Router();

// GET /api/products - Fetches only APPROVED products for the customer website
router.get("/", getAllProducts);

// GET /api/products/:id - Fetches a single APPROVED product
router.get("/:id", getProductById); 

export default router;