import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  image: String,
  images: [String], // ← This line must be here
  quantity: { type: Number, default: 1 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;