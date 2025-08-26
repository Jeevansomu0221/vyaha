import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    paymentMethod: "credit-card"
  });

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="orders-empty-container">
        <div className="orders-empty">
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
  const totalPrice = subtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically process the order and payment
    console.log("Order submitted:", { orderItems: cart, customerInfo: formData });
    
    // Simulate order processing
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="order-success-container">
        <div className="order-success">
          <div className="success-icon">✅</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Your order has been confirmed.</p>
          <p>You will receive an email confirmation shortly.</p>
          <div className="order-actions">
            <button onClick={() => navigate("/")} className="continue-shopping-btn">
              Continue Shopping
            </button>
            <button onClick={() => window.print()} className="print-receipt-btn">
              Print Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page-container">
      <div className="orders-header">
        <h1>Checkout</h1>
        <Link to="/cart" className="back-to-cart-link">
          ← Back to Cart
        </Link>
      </div>

      <div className="orders-content">
        <div className="order-form-section">
          <h2>Shipping Information</h2>
          <form onSubmit={handleSubmit} className="order-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Shipping Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === "credit-card"}
                    onChange={handleInputChange}
                  />
                  <span>Credit Card</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === "paypal"}
                    onChange={handleInputChange}
                  />
                  <span>PayPal</span>
                </label>
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash-on-delivery"
                    checked={formData.paymentMethod === "cash-on-delivery"}
                    onChange={handleInputChange}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            <button type="submit" className="place-order-btn">
              Place Order
            </button>
          </form>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-card">
            <div className="order-items">
              {cart.map((item) => (
                <div className="order-item" key={item.id}>
                  <img src={item.image} alt={item.name} className="order-item-img" />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity || 1}</p>
                    <p>Rs. {item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-total">
              <span>Total</span>
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="security-notice">
            <span>🔒 Your payment information is secure and encrypted.</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .orders-page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #333;
        }
        
        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eaeaea;
        }
        
        .orders-header h1 {
          font-size: 2rem;
          font-weight: 600;
          margin: 0;
        }
        
        .back-to-cart-link {
          color: #0066cc;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .back-to-cart-link:hover {
          color: #004d99;
          text-decoration: underline;
        }
        
        .orders-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
        }
        
        .order-form-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
        }
        
        .order-form-section h2 {
          margin: 0 0 1.5rem 0;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #444;
        }
        
        .form-group input {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: #0066cc;
        }
        
        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .payment-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .payment-option:hover {
          border-color: #0066cc;
          background: #f0f7ff;
        }
        
        .payment-option input[type="radio"] {
          width: auto;
          margin: 0;
        }
        
        .place-order-btn {
          width: 100%;
          padding: 1rem;
          background: #0066cc;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 1rem;
        }
        
        .place-order-btn:hover {
          background: #004d99;
        }
        
        .order-summary {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .order-summary h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .summary-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
        }
        
        .order-items {
          margin-bottom: 1.5rem;
        }
        
        .order-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .order-item:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        .order-item-img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 6px;
        }
        
        .order-item-details h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.95rem;
          font-weight: 500;
        }
        
        .order-item-details p {
          margin: 0.2rem 0;
          font-size: 0.85rem;
          color: #666;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.8rem;
          font-size: 0.95rem;
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
          margin: 1.5rem 0 0 0;
        }
        
        .security-notice {
          text-align: center;
          font-size: 0.9rem;
          color: #666;
        }
        
        .orders-empty-container, .order-success-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 60vh;
          padding: 2rem;
        }
        
        .orders-empty, .order-success {
          text-align: center;
          max-width: 400px;
        }
        
        .empty-icon, .success-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
        }
        
        .orders-empty h2, .order-success h2 {
          font-size: 1.8rem;
          margin: 0 0 1rem 0;
          color: #333;
        }
        
        .orders-empty p, .order-success p {
          color: #666;
          margin: 0 0 1rem 0;
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
          border: none;
          cursor: pointer;
          margin-right: 1rem;
        }
        
        .continue-shopping-btn:hover {
          background: #004d99;
        }
        
        .print-receipt-btn {
          display: inline-block;
          padding: 0.8rem 1.5rem;
          background: white;
          color: #333;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          transition: all 0.2s;
          border: 1px solid #ddd;
          cursor: pointer;
        }
        
        .print-receipt-btn:hover {
          background: #f8f8f8;
        }
        
        .order-actions {
          margin-top: 2rem;
        }
        
        @media (max-width: 900px) {
          .orders-content {
            grid-template-columns: 1fr;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 600px) {
          .orders-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .order-actions {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          
          .continue-shopping-btn, .print-receipt-btn {
            width: 100%;
            margin-right: 0;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default OrdersPage;