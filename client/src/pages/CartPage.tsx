// src/pages/CartPage.tsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "./CartPage.css";
import { useAuth } from "../context/AuthContext";

interface CartItem {
  id: number | string;
  name: string;
  brand?: string;
  image: string;
  price: number;
  quantity?: number;
}

const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const { user } = useAuth(); // user can be null if not logged in
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item: CartItem) => sum + item.price * (item.quantity || 1),
    0
  );
  const shippingFee = subtotal > 500 ? 0 : 50;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const totalPrice = subtotal + shippingFee - discount;

  const handleApplyCoupon = () => {
    if (couponCode.trim() !== "") {
      setCouponApplied(true);
    }
  };

  const handleQuantityChange = (id: number | string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/signin/customer?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

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

  return (
    <div className="cart-page-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <span>
          {cart.length} {cart.length === 1 ? "item" : "items"}
        </span>
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
            {cart.map((item: CartItem) => (
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
                    onClick={() =>
                      handleQuantityChange(item.id, (item.quantity || 1) - 1)
                    }
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity || 1}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, (item.quantity || 1) + 1)
                    }
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
              <span>{shippingFee === 0 ? "FREE" : `Rs. ${shippingFee}`}</span>
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
                className={couponApplied ? "applied" : ""}
              >
                {couponApplied ? "Applied" : "Apply"}
              </button>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>

            <button onClick={handleCheckout} className="checkout-btn">
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
    </div>
  );
};

export default CartPage;
