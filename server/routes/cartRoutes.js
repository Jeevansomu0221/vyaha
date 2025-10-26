// server/routes/cartRoutes.js
import express from "express";
import authCustomer from "../middleware/authCustomer.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// All cart routes require customer authentication
router.use(authCustomer);

// GET /api/cart - Get user's cart
router.get("/", getCart);

// POST /api/cart - Add item to cart
router.post("/", addToCart);

// PUT /api/cart/:productId - Update cart item quantity
router.put("/:productId", updateCartItem);

// DELETE /api/cart/:productId - Remove item from cart
router.delete("/:productId", removeFromCart);

// DELETE /api/cart - Clear entire cart
router.delete("/", clearCart);

export default router;