import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// Define the response type
interface ForgotPasswordResponse {
  message: string;
  success?: boolean;
}

const ForgotPasswordSeller: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // Fix: Type the response properly
      const res = await axios.post<ForgotPasswordResponse>("/api/seller/forgot-password", { email });
      setMessage(res.data.message || "Password reset link sent!");
    } catch (err: any) {
      console.error("❌ Forgot password error:", err);
      setMessage(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Forgot Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border p-3 rounded-md"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && (
          <p className={`text-center text-sm mt-4 ${
            message.includes("❌") || message.includes("Failed") 
              ? "text-red-600" 
              : "text-green-600"
          }`}>
            {message}
          </p>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          Remembered your password?{" "}
          <Link to="/signin/seller" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordSeller;