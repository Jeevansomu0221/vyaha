import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header.jsx";
import HeroSection from "./components/HeroSection.jsx";
import CategorySection from "./components/CategorySection.jsx";
import Footer from "./components/Footer.jsx";

import ProductListingPage from "./pages/ProductListingPage.jsx";
import ElectronicsListingPage from "./pages/ElectronicsListingPage.jsx";
import FoodsListingPage from "./pages/FoodsListingPage.jsx";
import ProductDetailsPage from "./pages/ProductDetailsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";

import { CartProvider } from "./context/CartContext.jsx";

export default function App() {
  return (
    <CartProvider>
      <Header />
      <Routes>
        {/* Homepage */}
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <CategorySection />
            </>
          }
        />

        {/* Listing Pages */}
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/foods" element={<FoodsListingPage />} />
        <Route path="/electronics" element={<ElectronicsListingPage />} />

        {/* Cart Page */}
        <Route path="/cart" element={<CartPage />} />
        
        {/* Orders/Checkout Page */}
        <Route path="/orders" element={<OrdersPage />} />

        {/* Product Details (shared across categories) */}
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/food/:id" element={<ProductDetailsPage />} />
        <Route path="/electronic/:id" element={<ProductDetailsPage />} />
      </Routes>
      <Footer />
    </CartProvider>
  );
}