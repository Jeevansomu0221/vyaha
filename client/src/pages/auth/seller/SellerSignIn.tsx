import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import "../Auth.css";

interface SellerLoginResponse {
  token: string;
  seller: {
    id: string;
    name: string;
    email: string;
    storeName: string;
  };
}

const SellerSignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post<SellerLoginResponse>(
        "/seller/auth/signin",
        { email, password }
      );

      const { token, seller } = res.data;
      
      const sellerWithToken = {
        ...seller,
        token,
        role: "seller",
      };

      // Use AuthContext login function to update state and localStorage
      login(sellerWithToken);
      
      // Keep these for backward compatibility
      localStorage.setItem("sellerToken", token);
      localStorage.setItem("seller", JSON.stringify(sellerWithToken));

      setMessage("Login successful! Redirecting...");
      console.log("✅ Seller signed in:", sellerWithToken);

      setTimeout(() => navigate("/seller/dashboard"), 1000);
    } catch (err: any) {
      console.error("❌ Seller signin failed:", err.response?.data);
      
      // Check if it's a verification error
      if (err.response?.data?.needsVerification) {
        setMessage("Please verify your email first. Check your inbox for OTP.");
        setTimeout(() => navigate("/seller/verify-otp"), 2000);
      } else {
        setMessage(err.response?.data?.message || "Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Seller Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {message && (
          <p className={`auth-message ${message.includes("successful") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <p className="text-center">
          Don't have an account? <a href="/signup/seller">Sign Up</a>
        </p>
        <p className="text-center">
          <a href="/seller/forgot-password">Forgot Password?</a>
        </p>
      </div>
    </div>
  );
};

export default SellerSignIn;