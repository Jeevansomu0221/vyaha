import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import "../Auth.css";

interface VerifyOTPResponse {
  message: string;
  token?: string;
  seller?: {
    id: string;
    name: string;
    email: string;
    storeName: string;
  };
}

const SellerVerifyOTP: React.FC = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get email from navigation state
  const email = location.state?.email || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage("Email not found. Please sign up again.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post<VerifyOTPResponse>("/seller/auth/verify-otp", {
        email,
        otp,
      });

      setMessage("Email verified successfully! Redirecting to sign in...");
      console.log("✅ OTP verified:", res.data);

      // If token is returned (auto-login after verification)
      if (res.data.token && res.data.seller) {
        const { token, seller } = res.data;
        
        const sellerWithToken = {
          ...seller,
          token,
          role: "seller",
        };
        
        // Use AuthContext to log in
        login(sellerWithToken);
        
        // Also keep backward compatibility
        localStorage.setItem("sellerToken", token);
        localStorage.setItem("seller", JSON.stringify(sellerWithToken));

        setMessage("Email verified successfully! Redirecting to dashboard...");
        setTimeout(() => navigate("/seller/dashboard"), 1500);
      } else {
        // If no token returned, redirect to signin
        setTimeout(() => navigate("/signin/seller"), 1500);
      }
    } catch (err: any) {
      console.error("❌ OTP verification failed:", err);
      setMessage(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setMessage("Email not found. Please sign up again.");
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      await axios.post("/seller/auth/resend-otp", { email });
      setMessage("✅ OTP resent! Check your email.");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify Your Email</h2>
        <p className="text-center">
          We've sent a 6-digit OTP to <strong>{email}</strong>
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            maxLength={6}
            required
            disabled={loading}
            style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.5rem" }}
          />
          
          <button type="submit" disabled={loading || otp.length !== 6}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {message && (
          <p className={`auth-message ${message.includes("success") || message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <div className="text-center" style={{ marginTop: "1rem" }}>
          <p>Didn't receive the code?</p>
          <button 
            onClick={handleResendOTP} 
            disabled={loading}
            style={{
              background: "transparent",
              color: "#007bff",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerVerifyOTP;