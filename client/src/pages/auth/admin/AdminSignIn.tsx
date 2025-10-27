import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../../api/axios"; // ✅ Use your axios instance
import "../Auth.css";

interface AdminLoginResponse {
  token: string;
  admin: {
    id: string;
    name: string;
    email: string;
  };
}

const AdminSignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ✅ Remove /api prefix (axios instance already has it)
      const res = await axios.post<AdminLoginResponse>(
        "/admin/auth/signin",
        { email, password }
      );

      const { token, admin } = res.data;

      // ✅ Store token in multiple places for compatibility
      localStorage.setItem("token", token); // Main token storage
      localStorage.setItem("adminToken", token); // Backup for admin
      
      // ✅ Store admin user with token
      const adminWithToken = { 
        ...admin, 
        token,
        role: "admin" // Add role for identification
      };
      
      localStorage.setItem("admin", JSON.stringify(adminWithToken));
      localStorage.setItem("authUser", JSON.stringify(adminWithToken)); // For AuthContext compatibility

      setMessage("Login successful! Redirecting...");
      console.log("✅ Admin signed in:", adminWithToken);

      setTimeout(() => navigate("/admin/dashboard"), 1000);
    } catch (err: any) {
      console.error("❌ Admin signin failed:", err.response?.data);
      setMessage(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Admin Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Enter password"
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

        <div className="auth-footer">
          <p>
            Default Credentials:<br />
            <small>Email: admin@vyahaweb.com</small><br />
            <small>Password: admin123</small>
          </p>
          <p className="text-center">
            Not an admin? <Link to="/">Go to home page</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;