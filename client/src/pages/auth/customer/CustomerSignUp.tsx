import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axios";

// Define types for API responses
interface SignUpResponse {
  message: string;
}

interface SignInResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface VerifyOTPResponse {
  message: string;
}

const CustomerSignUp: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    console.log("🔄 Attempting signup with:", { name, email, password: "***" });
    
    const response = await api.post<SignUpResponse>("/auth/signup", { 
      name, 
      email: email.toLowerCase().trim(),
      password 
    });
    
    console.log("✅ Signup successful:", response.data);
    alert(response.data.message);
    setStep("otp");
  } catch (error: any) {
    console.error("❌ FULL Signup error object:", error);
    console.error("❌ Error response data:", error.response?.data);
    console.error("❌ Error status:", error.response?.status);
    
    if (error.response?.data?.message) {
      alert(`Signup failed: ${error.response.data.message}`);
    } else if (error.code === 'ERR_NETWORK') {
      alert("Cannot connect to server. Please check if the backend is running.");
    } else {
      alert("Signup failed. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("🔄 Verifying OTP for:", email);
      
      // Verify OTP with proper typing
      const verifyResponse = await api.post<VerifyOTPResponse>("/auth/verify-otp", { 
        email: email.toLowerCase().trim(), 
        otp 
      });

      console.log("✅ OTP verified:", verifyResponse.data.message);
      
      // Auto sign in after verification
      console.log("🔄 Attempting auto login...");
      const signinResponse = await api.post<SignInResponse>("/auth/signin", { 
        email: email.toLowerCase().trim(), 
        password 
      });
      
      // TypeScript knows the structure of signinResponse.data
      const { user, token } = signinResponse.data;
      
      // Login with properly typed user data
      login(user);
      localStorage.setItem("token", token);
      
      console.log("✅ Login successful:", user);
      alert("Account verified & signed in!");
      navigate("/");
    } catch (error: any) {
      console.error("❌ OTP verification error:", error);
      
      if (error.response?.data?.message) {
        alert(`Verification failed: ${error.response.data.message}`);
      } else {
        alert("OTP verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Customer Sign Up</h2>

      {step === "form" && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            minLength={2}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            minLength={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerifyOTP}>
          <p>Check your email for the OTP code</p>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            disabled={loading}
            maxLength={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CustomerSignUp;