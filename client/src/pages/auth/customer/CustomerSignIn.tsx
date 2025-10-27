import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // ✅ import auth

const CustomerSignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // ✅ use login from context

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // get redirect param if present
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: replace with real API call
    console.log("Customer Sign In:", { email, password });

    // Mock user object
    const userData = {
      id: Date.now(),
      email,
      role: "customer",
    };

    // ✅ store user in AuthContext (and localStorage)
    login(userData);

    // ✅ go to redirect page or home
    navigate(redirect, { replace: true });
  };

  return (
    <div className="auth-container">
      <h2>Customer Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>

      {/* Sign Up Link */}
      <p style={{ marginTop: "10px" }}>
        Don't have an account?{" "}
        <Link to="/signup/customer" style={{ color: "blue" }}>
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default CustomerSignIn;
