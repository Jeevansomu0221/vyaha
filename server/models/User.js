import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: { type: String, enum: ["customer", "seller", "admin"], default: "customer" },

    // 🧱 Seller profile fields
    phone: String,
    storeName: String,
    storeAddress: String,
    city: String,
    state: String,
    pincode: String,

    verified: { type: Boolean, default: false },
    otp: String,
    otpExpiry: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
