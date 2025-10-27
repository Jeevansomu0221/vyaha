import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import "./AdminDashboard.css";

interface Seller {
  name: string;
  email: string;
  storeName?: string;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  seller: Seller;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPending = async () => {
    try {
      setLoading(true);
      setError("");
      
      // 🔍 DEBUG: Check what tokens are available
      const token = localStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken");
      const authUser = localStorage.getItem("authUser");
      
      console.log("🔍 DEBUG Admin Dashboard:");
      console.log("  token:", token?.substring(0, 20) + "...");
      console.log("  adminToken:", adminToken?.substring(0, 20) + "...");
      console.log("  authUser:", authUser);
      
      if (!token && !adminToken) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      // The axios interceptor should automatically add the token
      // But let's be explicit here
      const res = await axios.get<Product[]>("/admin/products/pending", {
        headers: { 
          Authorization: `Bearer ${token || adminToken}` 
        },
      });
      
      console.log("✅ Fetched pending products:", res.data.length);
      setPendingProducts(res.data);
    } catch (err: any) {
      console.error("❌ Failed to fetch pending products:", err);
      console.error("  Status:", err.response?.status);
      console.error("  Message:", err.response?.data?.message);
      console.error("  Full response:", err.response?.data);
      
      setError(err.response?.data?.message || "Failed to fetch pending products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      
      await axios.put(
        `/admin/products/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Remove from pending list
      setPendingProducts(pendingProducts.filter(p => p._id !== id));
      
      alert(`Product ${status} successfully!`);
    } catch (err: any) {
      console.error("Failed to update product status:", err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <p>Loading pending products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <h1>Admin Dashboard</h1>
        <div className="error-box">
          <p className="error">{error}</p>
          <button onClick={() => window.location.href = "/admin/signin"}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <h2>Pending Products ({pendingProducts.length})</h2>
      
      {pendingProducts.length === 0 ? (
        <p>No pending products to review.</p>
      ) : (
        <div className="products-grid">
          {pendingProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                {product.image ? (
                  <img src={product.image} alt={product.title} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              
              <div className="product-details">
                <h3>{product.title}</h3>
                <p className="price">${product.price}</p>
                <p className="category">{product.category}</p>
                <p className="description">{product.description}</p>
                
                <div className="seller-info">
                  <strong>Seller:</strong> {product.seller?.storeName || product.seller?.name}
                  <br />
                  <small>{product.seller?.email}</small>
                </div>
                
                <div className="product-actions">
                  <button 
                    className="btn-approve" 
                    onClick={() => updateStatus(product._id, "approved")}
                  >
                    ✓ Approve
                  </button>
                  <button 
                    className="btn-reject" 
                    onClick={() => updateStatus(product._id, "rejected")}
                  >
                    ✗ Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;