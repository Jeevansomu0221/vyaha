// server/controllers/cartController.js
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get user's cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId })
      .populate({
        path: "items.product",
        select: "title price image category status",
      });

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = new Cart({ user: req.userId, items: [] });
      await cart.save();
    }

    // Filter out products that are no longer approved
    cart.items = cart.items.filter(
      (item) => item.product && item.product.status === "approved"
    );

    // Calculate total
    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.json({
      items: cart.items,
      total: total.toFixed(2),
      itemCount: cart.items.length,
    });
  } catch (err) {
    console.error("❌ Get Cart Error:", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Check if product exists and is approved
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status !== "approved") {
      return res.status(400).json({ message: "Product is not available" });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity if already exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Populate and return updated cart
    cart = await Cart.findOne({ user: req.userId }).populate({
      path: "items.product",
      select: "title price image category status",
    });

    const total = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.json({
      message: "Item added to cart",
      items: cart.items,
      total: total.toFixed(2),
      itemCount: cart.items.length,
    });
  } catch (err) {
    console.error("❌ Add to Cart Error:", err);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Populate and return updated cart
    const updatedCart = await Cart.findOne({ user: req.userId }).populate({
      path: "items.product",
      select: "title price image category status",
    });

    const total = updatedCart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.json({
      message: "Cart updated",
      items: updatedCart.items,
      total: total.toFixed(2),
      itemCount: updatedCart.items.length,
    });
  } catch (err) {
    console.error("❌ Update Cart Error:", err);
    res.status(500).json({ message: "Failed to update cart" });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Filter out the item
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    // Populate and return updated cart
    const updatedCart = await Cart.findOne({ user: req.userId }).populate({
      path: "items.product",
      select: "title price image category status",
    });

    const total = updatedCart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    res.json({
      message: "Item removed from cart",
      items: updatedCart.items,
      total: total.toFixed(2),
      itemCount: updatedCart.items.length,
    });
  } catch (err) {
    console.error("❌ Remove from Cart Error:", err);
    res.status(500).json({ message: "Failed to remove item from cart" });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.json({
      message: "Cart cleared",
      items: [],
      total: "0.00",
      itemCount: 0,
    });
  } catch (err) {
    console.error("❌ Clear Cart Error:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};