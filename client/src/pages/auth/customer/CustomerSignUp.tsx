import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axios";
import "./auth.css";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("🔄 Attempting signup with:", { name, email });

      const response = await api.post<SignUpResponse>("/auth/signup", {
        name,
        email: email.toLowerCase().trim(),
        password,
      });

      console.log("✅ Signup successful:", response.data);
      setSuccess(response.data.message);
      setStep("otp");
    } catch (error: any) {
      console.error("❌ Signup error:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.code === "ERR_NETWORK") {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🔄 Verifying OTP for:", email);

      await api.post<VerifyOTPResponse>("/auth/verify-otp", {
        email: email.toLowerCase().trim(),
        otp,
      });

      console.log("✅ OTP verified");

      // Auto sign in after verification
      const signinResponse = await api.post<SignInResponse>("/auth/signin", {
        email: email.toLowerCase().trim(),
        password,
      });

      const { user, token } = signinResponse.data;

      localStorage.setItem("token", token);
      login(user);

      console.log("✅ Login successful:", user);
      setSuccess("Account verified & signed in!");
      
      setTimeout(() => navigate("/"), 1000);
    } catch (error: any) {
      console.error("❌ OTP verification error:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("OTP verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Customer Sign Up</h2>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                minLength={2}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
                className="form-input"
              />
            </div>

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOTP} className="auth-form">
            <p className="otp-instruction">
              📧 Check your email for the OTP code
            </p>

            <div className="form-group">
              <label htmlFor="otp">OTP Code</label>
              <input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={loading}
                maxLength={6}
                className="form-input otp-input"
              />
            </div>

            <button type="submit" disabled={loading} className="auth-button">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={() => setStep("form")}
              className="auth-button-secondary"
              disabled={loading}
            >
              Back to Sign Up
            </button>
          </form>
        )}

        {step === "form" && (
          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link to="/signin/customer" className="auth-link">
                Sign In
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSignUp;