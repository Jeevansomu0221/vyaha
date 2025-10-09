// server/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  image: String,
  category: String,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
