import React, { createContext, useState, useContext } from "react";

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add to cart (increase quantity if already in cart)
const addToCart = (product) => {
  setCart((prevCart) => {
    // Use name+id combo to uniquely identify products
    const uniqueKey = product.category + "-" + product.id;

    const existingItem = prevCart.find((item) => item.key === uniqueKey);

    if (existingItem) {
      return prevCart.map((item) =>
        item.key === uniqueKey
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [...prevCart, { ...product, key: uniqueKey, quantity: 1 }];
  });
};

  // Remove a product completely
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Clear all items
  const clearCart = () => {
    setCart([]);
  };

  // Decrease quantity (remove product if it reaches 0)
  const decreaseQuantity = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) // remove items with 0 quantity
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using cart context
export const useCart = () => useContext(CartContext);
