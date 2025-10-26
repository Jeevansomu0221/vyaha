// server/models/Order.js - Change to default export
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  // your order schema fields
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number
    }
  ],
  total: Number,
  status: { type: String, default: "pending" }
}, { timestamps: true });

// Change to default export
const Order = mongoose.model("Order", orderSchema);
export default Order;