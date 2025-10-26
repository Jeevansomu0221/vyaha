// server/routes/orderRoutes.js
import express from "express";
import authCustomer from "../middleware/authCustomer.js";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// All order routes require customer authentication
router.use(authCustomer);

// POST /api/orders - Create new order
router.post("/", createOrder);

// GET /api/orders - Get user's orders
router.get("/", getUserOrders);

// GET /api/orders/:id - Get single order by ID
router.get("/:id", getOrderById);

// PUT /api/orders/:id/status - Update order status (for admin/seller)
router.put("/:id/status", updateOrderStatus);

export default router;