
import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

  // Get product passed from ProductListingPage
  const product = location.state?.product;

  if (!product) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Product not found!</h2>
          <p>The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const updateQuantity = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const discountPercentage = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

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
            {/* Product Header */}
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
              <span className="reviews-count">({product.reviews} reviews)</span>
            </div>

            {/* Price Section */}
            <div className="price-section">
              <div className="price">
                <span className="current-price">Rs. {product.price.toLocaleString()}</span>
                <span className="old-price">Rs. {product.oldPrice.toLocaleString()}</span>
              </div>
              <div className="savings">
                <span className="discount-badge">{discountPercentage}% OFF</span>
                <span className="discount">You save Rs. {product.discount.toLocaleString()}</span>
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

            {/* Key Features */}
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
                  onClick={() => updateQuantity('decrease')}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button 
                  className="qty-btn" 
                  onClick={() => updateQuantity('increase')}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="buttons">
              <button className="add-cart" onClick={handleAddToCart}>
                <span>🛒</span> Add to Cart
              </button>
              <button className="buy-now">
                <span>⚡</span> Buy Now
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

      <style>{`
        /* Container */
        .product-details-container {
          min-height: 100vh;
          background: #f8fafc;
          padding: 1rem;
        }

        /* Error State */
        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 70vh;
          padding: 1rem;
        }

        .error-content {
          text-align: center;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .error-content h2 {
          color: #e53e3e;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .error-content p {
          color: #666;
          font-size: 0.9rem;
        }

        /* Success Notification */
        .notification {
          position: fixed;
          top: 15px;
          right: 15px;
          background: #48bb78;
          color: white;
          padding: 0.8rem 1.2rem;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(72, 187, 120, 0.3);
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
          font-weight: 500;
          font-size: 0.9rem;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Main Product Details */
        .product-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          overflow: hidden;
          padding: 0;
        }

        /* Left side images */
        .product-images {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 1.5rem;
          background: #f7fafc;
        }

        .images-section {
          width: 100%;
          max-width: 320px;
        }

        .detail-image-wrapper {
          width: 100%;
          position: relative;
          margin-bottom: 1rem;
        }

        .detail-image {
          width: 100%;
          height: auto;
          object-fit: contain;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        /* Thumbnail Container */
        .thumbnail-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }

        .thumbnail-box {
          aspect-ratio: 1;
          background: #f1f5f9;
          border: 1px dashed #cbd5e0;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
        }

        .thumbnail-box:hover {
          border-color: #3182ce;
          background: #e6f3ff;
        }

        .thumbnail-box::after {
          content: '+';
          font-size: 1rem;
          color: #a0aec0;
          font-weight: bold;
        }

        .thumbnail-box:hover::after {
          color: #3182ce;
        }

        /* Right side product info */
        .product-info-details {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        /* Product Header */
        .product-header {
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 1rem;
        }

        .brand-badge {
          margin-bottom: 0.5rem;
        }

        .brand {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .product-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          line-height: 1.2;
          margin: 0;
        }

        /* Rating Section */
        .rating-section {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .stars {
          color: #f6ad55;
          font-size: 1rem;
        }

        .rating-number {
          font-size: 0.9rem;
          font-weight: 600;
          color: #2d3748;
        }

        .reviews-count {
          color: #718096;
          font-size: 0.8rem;
        }

        /* Price Section */
        .price-section {
          background: #f0fff4;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #9ae6b4;
        }

        .price {
          display: flex;
          align-items: baseline;
          gap: 0.8rem;
          margin-bottom: 0.3rem;
        }

        .current-price {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2d3748;
        }

        .old-price {
          font-size: 1.1rem;
          text-decoration: line-through;
          color: #718096;
        }

        .savings {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .discount-badge {
          background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
          color: white;
          padding: 0.2rem 0.6rem;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .discount {
          color: #38a169;
          font-weight: 600;
          font-size: 0.9rem;
        }

        /* Description Section */
        .description-section h3,
        .features-section h3,
        .quantity-section h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .description {
          line-height: 1.5;
          color: #4a5568;
          font-size: 0.9rem;
          margin: 0;
        }

        /* Features Section */
        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .features-list li {
          padding: 0.3rem 0;
          color: #4a5568;
          font-size: 0.9rem;
          position: relative;
          padding-left: 1.2rem;
        }

        .features-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #48bb78;
          font-weight: bold;
          font-size: 0.9rem;
        }

        /* Quantity Section */
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
          width: fit-content;
        }

        .qty-btn {
          background: #f7fafc;
          border: none;
          padding: 0.5rem 0.8rem;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #4a5568;
        }

        .qty-btn:hover:not(:disabled) {
          background: #edf2f7;
          color: #2d3748;
        }

        .qty-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-display {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          background: white;
          border-left: 1px solid #e2e8f0;
          border-right: 1px solid #e2e8f0;
          color: #2d3748;
          min-width: 40px;
          text-align: center;
        }

        /* Action Buttons */
        .buttons {
          display: flex;
          gap: 0.8rem;
          margin-top: 0.5rem;
        }

        .buy-now,
        .add-cart {
          flex: 1;
          padding: 0.7rem 1rem;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.3rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .buy-now {
          background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(237, 137, 54, 0.3);
        }

        .buy-now:hover {
          background: linear-gradient(135deg, #dd6b20 0%, #c05621 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(237, 137, 54, 0.4);
        }

        .add-cart {
          background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(49, 130, 206, 0.3);
        }

        .add-cart:hover {
          background: linear-gradient(135deg, #2c5282 0%, #2a4365 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(49, 130, 206, 0.4);
        }

        /* Service Features */
        .service-features {
          display: flex;
          justify-content: space-around;
          gap: 0.8rem;
          margin-top: 1.2rem;
          padding-top: 1.2rem;
          border-top: 1px solid #e2e8f0;
        }

        .service-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.7rem;
          background: #f7fafc;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }

        .service-icon {
          font-size: 1.2rem;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }

        .service-item strong {
          color: #2d3748;
          font-size: 0.85rem;
          display: block;
          margin-bottom: 0.1rem;
        }

        .service-item p {
          color: #718096;
          font-size: 0.75rem;
          margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .product-details-container {
            padding: 0.5rem;
          }
          
          .product-details {
            grid-template-columns: 1fr;
            gap: 0;
          }
          
          .product-images,
          .product-info-details {
            padding: 1rem;
          }
          
          .product-title {
            font-size: 1.3rem;
          }
          
          .current-price {
            font-size: 1.5rem;
          }
          
          .buttons {
            flex-direction: column;
          }
          
          .notification {
            top: 10px;
            right: 10px;
            left: 10px;
            text-align: center;
            font-size: 0.8rem;
            padding: 0.6rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .product-images,
          .product-info-details {
            padding: 0.8rem;
          }
          
          .product-title {
            font-size: 1.2rem;
          }
          
          .current-price {
            font-size: 1.4rem;
          }
          
          .price {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.3rem;
          }
          
          .thumbnail-container {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .service-features {
            flex-direction: column;
          }
          
          .service-item {
            padding: 0.6rem;
          }
          
          .service-icon {
            font-size: 1rem;
            width: 25px;
            height: 25px;
          }
        }
      `}</style>
    </>
  );
};

export default ProductDetailsPage;