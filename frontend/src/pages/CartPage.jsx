import React from "react";
import { useCart } from "../context/CartContext.jsx";
import "./CartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) {
    return <div className="cart-empty">Your cart is empty!</div>;
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <div className="cart-container">
      <h2 className="cart-title">🛒 Your Shopping Cart</h2>

      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} className="cart-item-img" />
            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>Qty: {item.quantity || 1}</p>
              <p>Price: Rs. {item.price}</p>
              <p>Subtotal: Rs. {item.price * (item.quantity || 1)}</p>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total: Rs. {totalPrice}</h3>
        <button className="clear-btn" onClick={clearCart}>
          Clear Cart
        </button>
        <button className="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;
