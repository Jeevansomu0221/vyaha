// src/pages/ProductDetailsPage.tsx
import React, { useState } from "react";
import {  useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { CartItem } from "../context/CartContext"; // ✅ Import CartItem type
import "./ProductDetailsPage.css";

// Define a type for the product object (for UI purposes)
interface Product {
  id: string;
  name: string;
  image: string;
  brand: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice: number;
  discount: number;
  description?: string;
}

const ProductDetailsPage: React.FC = () => {
  const location = useLocation();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState<number>(1);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  // Get product passed via navigation state
  const product: Product | undefined = location.state?.product;

  if (!product) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Product not found!</h2>
          <p>
            The product you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // ✅ Fix typing: use CartItem
  const handleAddToCart = () => {
    const item: CartItem = { ...product, quantity };
    addToCart(item);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const updateQuantity = (action: "increase" | "decrease") => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const discountPercentage = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  return (
    <>
     
      <div className="product-details-container">
        {/* Success Notification */}
        {showNotification && (
          <div className="notification">
            <span>✓ {product.name} has been added to your cart!</span>
          </div>
        )}

        <div className="product-details">
          {/* Product Images */}
          <div className="product-images">
            <div className="images-section">
              <div className="detail-image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="detail-image"
                />
              </div>

              {/* Thumbnail Images Section */}
              <div className="thumbnail-container">
                <div className="thumbnail-box"></div>
                <div className="thumbnail-box"></div>
                <div className="thumbnail-box"></div>
                <div className="thumbnail-box"></div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-details">
            <div className="product-header">
              <div className="brand-badge">
                <span className="brand">{product.brand}</span>
              </div>
              <h1 className="product-title">{product.name}</h1>
            </div>

            {/* Rating Section */}
            <div className="rating-section">
              <div className="rating">
                <span className="stars">★★★★★</span>
                <span className="rating-number">{product.rating}</span>
              </div>
              <span className="reviews-count">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price Section */}
            <div className="price-section">
              <div className="price">
                <span className="current-price">
                  Rs. {product.price.toLocaleString()}
                </span>
                <span className="old-price">
                  Rs. {product.oldPrice.toLocaleString()}
                </span>
              </div>
              <div className="savings">
                <span className="discount-badge">
                  {discountPercentage}% OFF
                </span>
                <span className="discount">
                  You save Rs. {product.discount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Product Description */}
            <div className="description-section">
              <h3>Product Details</h3>
              <p className="description">
                {product.description ||
                  "This is a high-quality product made with premium materials. Perfect for daily use with excellent durability and performance."}
              </p>
            </div>

            {/* Features */}
            <div className="features-section">
              <h3>Key Features</h3>
              <ul className="features-list">
                <li>Premium Quality Materials</li>
                <li>Durable Construction</li>
                <li>Easy to Use</li>
                <li>Perfect for Daily Use</li>
              </ul>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <h3>Quantity</h3>
              <div className="quantity-controls">
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity("decrease")}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => updateQuantity("increase")}
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="buttons">
              <button className="add-cart" onClick={handleAddToCart}>
                <span role="img" aria-label="cart">
                  🛒
                </span>{" "}
                Add to Cart
              </button>
              <button className="buy-now">
                <span role="img" aria-label="buy">
                  ⚡
                </span>{" "}
                Buy Now
              </button>
            </div>

            {/* Service Features */}
            <div className="service-features">
              <div className="service-item">
                <span className="service-icon">🚚</span>
                <div>
                  <strong>Free Delivery</strong>
                  <p>On orders above Rs. 500</p>
                </div>
              </div>
              <div className="service-item">
                <span className="service-icon">🛡️</span>
                <div>
                  <strong>Warranty</strong>
                  <p>1 Year manufacturer warranty</p>
                </div>
              </div>
              <div className="service-item">
                <span className="service-icon">↩️</span>
                <div>
                  <strong>Easy Returns</strong>
                  <p>7-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
