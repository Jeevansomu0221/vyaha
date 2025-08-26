import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="cart-empty">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const shippingFee = subtotal > 500 ? 0 : 50;
  const discount = couponApplied ? subtotal * 0.1 : 0; // 10% discount if coupon applied
  const totalPrice = subtotal + shippingFee - discount;

  const handleApplyCoupon = () => {
    if (couponCode.trim() !== "") {
      setCouponApplied(true);
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    navigate("/orders");
  };

  return (
    <div className="cart-page-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <span>{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
      </div>

      <div className="cart-content">
        <div className="cart-items-section">
          <div className="cart-items-header">
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
            <span>Action</span>
          </div>

          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="item-info">
                  <img src={item.image} alt={item.name} className="cart-item-img" />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="brand">{item.brand}</p>
                  </div>
                </div>
                
                <div className="item-price">Rs. {item.price.toLocaleString()}</div>
                
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity || 1}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
                
                <div className="item-subtotal">
                  Rs. {(item.price * (item.quantity || 1)).toLocaleString()}
                </div>
                
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-actions">
            <Link to="/" className="continue-shopping-link">
              ← Continue Shopping
            </Link>
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>

        <div className="cart-summary">
          <div className="summary-card">
            <h3>Order Summary</h3>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}</span>
            </div>
            
            {couponApplied && (
              <div className="summary-row discount">
                <span>Discount (10%)</span>
                <span>- Rs. {discount.toLocaleString()}</span>
              </div>
            )}
            
            <div className="coupon-section">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
              />
              <button 
                onClick={handleApplyCoupon}
                disabled={couponApplied}
                className={couponApplied ? 'applied' : ''}
              >
                {couponApplied ? 'Applied' : 'Apply'}
              </button>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-total">
              <span>Total</span>
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>
            
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            
            <div className="security-notice">
              <span>🔒 Secure checkout. All data is encrypted.</span>
            </div>
          </div>
          
          <div className="benefits-section">
            <div className="benefit">
              <span>🚚</span>
              <div>
                <strong>Free Shipping</strong>
                <p>On orders over Rs. 500</p>
              </div>
            </div>
            <div className="benefit">
              <span>↩️</span>
              <div>
                <strong>Easy Returns</strong>
                <p>30-day money back guarantee</p>
              </div>
            </div>
            <div className="benefit">
              <span>🛡️</span>
              <div>
                <strong>Secure Payment</strong>
                <p>Safe and encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cart-page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
        }
        
        .cart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eaeaea;
        }
        
        .cart-header h1 {
          font-size: 2rem;
          font-weight: 600;
          margin: 0;
        }
        
        .cart-header span {
          color: #666;
          font-size: 0.9rem;
        }
        
        .cart-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
        }
        
        .cart-items-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
        }
        
        .cart-items-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr;
          padding: 0.5rem 0;
          margin-bottom: 1rem;
          font-weight: 600;
          border-bottom: 1px solid #f0f0f0;
          color: #666;
          font-size: 0.9rem;
        }
        
        .cart-item {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr;
          align-items: center;
          padding: 1.5rem 0;
          border-bottom: 1px solid #f5f5f5;
        }
        
        .item-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .cart-item-img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
        }
        
        .item-details h3 {
          margin: 0 0 0.3rem 0;
          font-size: 1rem;
          font-weight: 500;
        }
        
        .item-details .brand {
          color: #666;
          font-size: 0.85rem;
          margin: 0;
        }
        
        .item-price, .item-subtotal {
          font-weight: 500;
        }
        
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .qty-btn {
          width: 28px;
          height: 28px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }
        
        .qty-btn:hover {
          background: #f8f8f8;
          border-color: #ccc;
        }
        
        .quantity {
          min-width: 30px;
          text-align: center;
          font-weight: 500;
        }
        
        .remove-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          color: #999;
          cursor: pointer;
          padding: 0.2rem;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .remove-btn:hover {
          background: #ffe6e6;
          color: #ff3b30;
        }
        
        .cart-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }
        
        .continue-shopping-link {
          color: #0066cc;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .continue-shopping-link:hover {
          color: #004d99;
          text-decoration: underline;
        }
        
        .clear-cart-btn {
          background: none;
          border: 1px solid #ddd;
          color: #666;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .clear-cart-btn:hover {
          background: #f8f8f8;
          border-color: #ccc;
        }
        
        .cart-summary {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .summary-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
        }
        
        .summary-card h3 {
          margin: 0 0 1.5rem 0;
          font-size: 1.2rem;
          font-weight: 600;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
        
        .summary-row.discount {
          color: #00a650;
          font-weight: 500;
        }
        
        .coupon-section {
          display: flex;
          gap: 0.5rem;
          margin: 1.5rem 0;
        }
        
        .coupon-section input {
          flex: 1;
          padding: 0.7rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.9rem;
        }
        
        .coupon-section button {
          padding: 0 1rem;
          background: #0066cc;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
        }
        
        .coupon-section button:hover:not(:disabled) {
          background: #004d99;
        }
        
        .coupon-section button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }
        
        .coupon-section button.applied {
          background: #00a650;
        }
        
        .coupon-section button.applied:hover {
          background: #008a40;
        }
        
        .summary-divider {
          height: 1px;
          background: #eaeaea;
          margin: 1rem 0;
        }
        
        .summary-total {
          display: flex;
          justify-content: space-between;
          font-weight: 600;
          font-size: 1.1rem;
          margin: 1.5rem 0;
        }
        
        .checkout-btn {
          width: 100%;
          padding: 1rem;
          background: #0066cc;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .checkout-btn:hover {
          background: #004d99;
        }
        
        .security-notice {
          text-align: center;
          margin-top: 1rem;
          font-size: 0.8rem;
          color: #666;
        }
        
        .benefits-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
        }
        
        .benefit {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .benefit:last-child {
          margin-bottom: 0;
        }
        
        .benefit span {
          font-size: 1.5rem;
        }
        
        .benefit div {
          flex: 1;
        }
        
        .benefit strong {
          display: block;
          font-size: 0.95rem;
          margin-bottom: 0.2rem;
        }
        
        .benefit p {
          margin: 0;
          font-size: 0.85rem;
          color: #666;
        }
        
        .cart-empty-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          padding: 2rem;
        }
        
        .cart-empty {
          text-align: center;
          max-width: 400px;
        }
        
        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }
        
        .cart-empty h2 {
          font-size: 1.8rem;
          margin: 0 0 1rem 0;
          color: #333;
        }
        
        .cart-empty p {
          color: #666;
          margin: 0 0 2rem 0;
          line-height: 1.5;
        }
        
        .continue-shopping-btn {
          display: inline-block;
          padding: 0.8rem 1.5rem;
          background: #0066cc;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          transition: background 0.2s;
        }
        
        .continue-shopping-btn:hover {
          background: #004d99;
        }
        
        @media (max-width: 900px) {
          .cart-content {
            grid-template-columns: 1fr;
          }
          
          .cart-items-header {
            display: none;
          }
          
          .cart-item {
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1.5rem;
            border: 1px solid #f0f0f0;
            border-radius: 8px;
            margin-bottom: 1rem;
          }
          
          .item-info {
            grid-column: 1 / -1;
          }
          
          .item-price, .quantity-controls, .item-subtotal, .remove-btn {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem 0;
            border-top: 1px solid #f5f5f5;
          }
          
          .item-price::before {
            content: 'Price:';
            font-weight: 500;
          }
          
          .item-subtotal::before {
            content: 'Subtotal:';
            font-weight: 500;
          }
        }
        
        @media (max-width: 600px) {
          .cart-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .cart-actions {
            flex-direction: column;
            gap: 1rem;
          }
          
          .continue-shopping-link, .clear-cart-btn {
            width: 100%;
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;