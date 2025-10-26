// server/controllers/orderController.js
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Create new order from cart
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = "COD" } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Filter only approved products
    const validItems = cart.items.filter(
      (item) => item.product && item.product.status === "approved"
    );

    if (validItems.length === 0) {
      return res.status(400).json({ message: "No valid products in cart" });
    }

    // Calculate totals
    const subtotal = validItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const shippingCost = subtotal > 500 ? 0 : 50; // Free shipping over $500
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shippingCost + tax;

    // Create order items
    const orderItems = validItems.map((item) => ({
      product: item.product._id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image,
    }));

    // Create order
    const order = new Order({
      user: req.userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal: subtotal.toFixed(2),
      shippingCost: shippingCost.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      status: "pending",
    });

    await order.save();

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("❌ Create Order Error:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// Get all orders for logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate("items.product", "title image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Get User Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      user: req.userId, // Ensure user can only access their own orders
    }).populate("items.product", "title image category");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("❌ Get Order By ID Error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

// Update order status (for admin/seller)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    if (status === "delivered") {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      message: "Order status updated",
      order,
    });
  } catch (err) {
    console.error("❌ Update Order Status Error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};