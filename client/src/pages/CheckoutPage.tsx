// src/pages/CheckoutPage.tsx
import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import { useOrders } from "../context/OrdersContext";
import type { Order, OrderItem } from "../context/OrdersContext";
type PaymentMethod = "cod" | "card" | "upi";

// inside CheckoutPage


const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
const { addOrder } = useOrders();

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const shippingFee = subtotal > 500 ? 0 : 50;
  const total = subtotal + shippingFee;

 const handleConfirmOrder = () => {
  const orderItems: OrderItem[] = cart.map((item) => ({
  id: typeof item.id === "number" ? item.id : Number(item.id), // ensure number
  name: item.name,
  price: item.price,
  quantity: item.quantity,
}));

  const order: Order = {
    id: Date.now(),
    items: orderItems,
    total: orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };

  addOrder(order);
  clearCart();
  navigate("/orders");
};


  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      {/* Stepper */}
      <div className="checkout-steps">
        <div className={step === 1 ? "active-step" : ""}>1. Address</div>
        <div className={step === 2 ? "active-step" : ""}>2. Payment</div>
        <div className={step === 3 ? "active-step" : ""}>3. Review</div>
      </div>

      {/* Step 1: Address */}
      {step === 1 && (
        <div className="checkout-section">
          <h2>Shipping Address</h2>
          <form className="address-form">
            <input
              type="text"
              placeholder="Full Name"
              value={address.fullName}
              onChange={(e) =>
                setAddress({ ...address, fullName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={address.phone}
              onChange={(e) =>
                setAddress({ ...address, phone: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Street Address"
              value={address.street}
              onChange={(e) =>
                setAddress({ ...address, street: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
            <input
              type="text"
              placeholder="State"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={address.zip}
              onChange={(e) => setAddress({ ...address, zip: e.target.value })}
            />
          </form>
          <button
            className="next-btn"
            onClick={() => setStep(2)}
            disabled={
              !address.fullName ||
              !address.phone ||
              !address.street ||
              !address.city ||
              !address.state ||
              !address.zip
            }
          >
            Continue to Payment →
          </button>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div className="checkout-section">
          <h2>Payment Method</h2>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on Delivery
            </label>
            <label>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === "card"}
                onChange={() => setPaymentMethod("card")}
              />
              Credit / Debit Card
            </label>
            <label>
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === "upi"}
                onChange={() => setPaymentMethod("upi")}
              />
              UPI (Google Pay, PhonePe, Paytm)
            </label>
          </div>
          <div className="step-actions">
            <button onClick={() => setStep(1)}>← Back</button>
            <button onClick={() => setStep(3)}>Review Order →</button>
          </div>
        </div>
      )}

      {/* Step 3: Review Order */}
      {step === 3 && (
        <div className="checkout-section">
          <h2>Review Your Order</h2>

          <div className="review-address">
            <h3>Delivery Address</h3>
            <p>
              {address.fullName}, {address.phone}
            </p>
            <p>
              {address.street}, {address.city}, {address.state} - {address.zip}
            </p>
          </div>

          <div className="review-cart">
            <h3>Items</h3>
            {cart.map((item) => (
              <div key={item.id} className="review-item">
                <span>
                  {item.name} × {item.quantity || 1}
                </span>
                <span>Rs. {item.price * (item.quantity || 1)}</span>
              </div>
            ))}
          </div>

          <div className="review-summary">
            <div>Subtotal: Rs. {subtotal}</div>
            <div>Shipping: {shippingFee === 0 ? "FREE" : `Rs. ${shippingFee}`}</div>
            <strong>Total: Rs. {total}</strong>
          </div>

          <div className="step-actions">
            <button onClick={() => setStep(2)}>← Back</button>
            <button onClick={handleConfirmOrder} className="confirm-btn">
              ✅ Confirm Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
