import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import "../Auth.css";

interface SellerSignUpResponse {
  message: string;
  seller?: {
    id: string;
    name: string;
    email: string;
    storeName: string;
  };
}

const SellerSignUp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    storeName: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ✅ Correct endpoint: /seller/auth/signup
      const res = await axios.post<SellerSignUpResponse>("/seller/auth/signup", formData);
      
      setMessage(res.data.message || "Signup successful! Please check your email for OTP.");
      console.log("✅ Seller signup successful:", res.data);

      // Redirect to OTP verification page
      setTimeout(() => {
        navigate("/seller/verify-otp", { state: { email: formData.email } });
      }, 2000);
    } catch (err: any) {
      console.error("❌ Seller Signup Error:", err);
      setMessage(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Seller Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            disabled={loading}
          />
          <input
            type="text"
            name="storeName"
            placeholder="Store Name"
            value={formData.storeName}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p className={`auth-message ${message.includes("successful") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <p className="text-center">
          Already have an account? <a href="/seller/signin">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default SellerSignUp;