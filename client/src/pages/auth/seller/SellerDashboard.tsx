import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import "./SellerDashboard.css";

interface Product {
  _id?: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  images?: string[]; // Multiple images
  quantity?: number;
  status?: "pending" | "approved" | "rejected";
  createdAt?: string;
}

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [newProduct, setNewProduct] = useState<Product>({
    title: "",
    price: 0,
    category: "",
    description: "",
    image: "",
    quantity: 1,
  });

  // Fetch seller products
  useEffect(() => {
    if (!user) return;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Product[]>("/seller/products", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch seller products:", err);
        alert("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [user]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setImageFiles(fileArray);

    // Create previews
    const previews = fileArray.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // Remove image
  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  // Submit new product
  const handleAddProduct = async (e: FormEvent) => {
  e.preventDefault();
  
  console.log("🔵 1. Form submitted!");
  console.log("🔵 2. User object:", user);
  console.log("🔵 3. User token:", user?.token);
  console.log("🔵 4. Image files count:", imageFiles.length);
  console.log("🔵 5. Product data:", newProduct);
  
  if (!user) {
    console.error("❌ No user - stopping here");
    alert("Please log in first");
    return;
  }

  if (!newProduct.title || !newProduct.price) {
    console.error("❌ Missing title or price - stopping here");
    alert("Please fill in title and price");
    return;
  }

  if (imageFiles.length === 0) {
    console.error("❌ No images - stopping here");
    alert("Please upload at least one product image");
    return;
  }

  console.log("🔵 6. All validations passed, preparing FormData...");
  setSubmitting(true);

  try {
    const formData = new FormData();
    formData.append("title", newProduct.title);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price.toString());
    formData.append("category", newProduct.category);
    formData.append("quantity", (newProduct.quantity || 1).toString());

    imageFiles.forEach((file, index) => {
      console.log(`🔵 7. Appending image ${index + 1}:`, file.name);
      formData.append("images", file);
    });

    console.log("🔵 8. Sending POST request to /seller/products");

    const res = await axios.post<{ product: Product }>(
      "/seller/products",
      formData,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ 9. SUCCESS! Response:", res.data);
    alert("Product submitted for admin approval!");
    // ... rest
  } catch (err: any) {
    console.error("❌ 10. ERROR occurred:", err);
    console.error("❌ Error response:", err.response?.data);
    console.error("❌ Error status:", err.response?.status);
    alert(err.response?.data?.message || "Failed to add product");
  } finally {
    setSubmitting(false);
    console.log("🔵 11. Submission finished");
  }
};


  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "approved":
        return <span className="status-badge approved">✓ Approved</span>;
      case "rejected":
        return <span className="status-badge rejected">✗ Rejected</span>;
      case "pending":
      default:
        return <span className="status-badge pending">⏳ Pending</span>;
    }
  };

  const pendingCount = products.filter(p => p.status === "pending").length;
  const approvedCount = products.filter(p => p.status === "approved").length;
  const rejectedCount = products.filter(p => p.status === "rejected").length;

  return (
    <div className="seller-dashboard">
      <div className="dashboard-header">
        <h1>Seller Dashboard</h1>
        <button 
          className="btn-home" 
          onClick={() => navigate("/")}
        >
          🏠 Return to Home
        </button>
      </div>

      {/* Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>{products.length}</h3>
          <p>Total Products</p>
        </div>
        <div className="stat-card approved">
          <h3>{approvedCount}</h3>
          <p>Approved</p>
        </div>
        <div className="stat-card pending">
          <h3>{pendingCount}</h3>
          <p>Pending</p>
        </div>
        <div className="stat-card rejected">
          <h3>{rejectedCount}</h3>
          <p>Rejected</p>
        </div>
      </div>

      {/* Add Product Form */}
      <div className="form-section">
        <h2>Add New Product</h2>
        <form onSubmit={handleAddProduct} className="product-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Product Title *"
              value={newProduct.title}
              onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
              required
              disabled={submitting}
            />
            <input
              type="number"
              placeholder="Price *"
              value={newProduct.price || ""}
              onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
              required
              min="0"
              step="0.01"
              disabled={submitting}
            />
          </div>
          
          <div className="form-row">
            <input
              type="text"
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              disabled={submitting}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={newProduct.quantity || 1}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
              min="1"
              disabled={submitting}
            />
          </div>

          <textarea
            placeholder="Product Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            rows={4}
            disabled={submitting}
          />
          
          {/* Image Upload */}
          <div className="image-upload-section">
            <label className="file-upload-label">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={submitting}
                style={{ display: "none" }}
              />
              <span className="upload-button">
                📷 Upload Product Images (Multiple)
              </span>
            </label>
            
            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                      disabled={submitting}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit for Approval"}
          </button>
        </form>
      </div>

      {/* Products List */}
      <div className="products-section">
        <h2>My Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p className="no-products">No products yet. Add your first product above!</p>
        ) : (
          <div className="products-table-container">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Date Added</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="product-thumb" />
                      ) : (
                        <div className="no-thumb">No Image</div>
                      )}
                    </td>
                    <td>{p.title}</td>
                    <td>{p.category || "N/A"}</td>
                    <td>${p.price}</td>
                    <td>{p.quantity || 1}</td>
                    <td>{getStatusBadge(p.status)}</td>
                    <td>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;