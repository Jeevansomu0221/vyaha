// src/pages/OrdersPage.tsx
import React from "react";
import { useOrders } from "../context/OrdersContext";
import { useNavigate } from "react-router-dom";
import type { Order, OrderItem } from "../context/OrdersContext";
import styles from "./OrdersPage.module.css";

const OrdersPage: React.FC = () => {
  const { orders } = useOrders();
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate("/");
  };

  if (orders.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📦</div>
          <h2 className={styles.emptyMessage}>No orders found</h2>
          <p className={styles.emptySubtext}>You haven't placed any orders yet.</p>
          <button 
            className={styles.continueShoppingButton}
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Your Orders</h1>
      <div className={styles.ordersList}>
        {orders.map((order: Order) => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <h3 className={styles.orderId}>Order #{order.id}</h3>
              <span className={styles.orderTotal}>₹{order.total}</span>
            </div>
            <ul className={styles.orderItems}>
              {order.items.map((item: OrderItem) => (
                <li key={item.id} className={styles.orderItem}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemQuantity}>× {item.quantity}</span>
                  </div>
                  <span className={styles.itemPrice}>
                    ₹{item.price * item.quantity}
                  </span>
                </li>
              ))}
            </ul>
            <div className={styles.totalSection}>
              <span>Total:</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.continueShoppingSection}>
        <button 
          className={styles.continueShoppingButton}
          onClick={handleContinueShopping}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;