import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  storeName: { type: String },
  password: { type: String, required: true },
  otp: { type: String },          // store OTP for verification
  isVerified: { type: Boolean, default: false }, // track if email verified
});

export default mongoose.model("Seller", sellerSchema);
