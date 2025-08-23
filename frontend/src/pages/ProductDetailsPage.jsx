import React from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ProductDetailsPage.css";
import { useCart } from "../context/CartContext";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();

  // Get product passed from ProductListingPage
  const product = location.state?.product;

  if (!product) {
    return <div style={{ padding: "2rem" }}>Product not found!</div>;
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} has been added to your cart!`);
  };

  return (
    <div className="product-details">
      {/* Product Images */}
      <div className="product-images">
        <div className="detail-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="detail-image"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info-details">
        <h1>{product.name}</h1>
        <p className="brand">Brand: {product.brand}</p>
        <div className="rating">
          ★ {product.rating} ({product.reviews} reviews)
        </div>
        <div className="price">
          <span className="current-price">Rs. {product.price}</span>
          <span className="old-price">Rs. {product.oldPrice}</span>
          <span className="discount">(Rs. {product.discount} OFF)</span>
        </div>
        <p className="description">
          {product.description ||
            "This is a high-quality product made with premium materials. Perfect for daily use."}
        </p>
        <div className="buttons">
          <button className="buy-now">Buy Now</button>
          <button className="add-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
