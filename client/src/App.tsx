import React from "react";
import { Routes, Route } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import CategorySection from "./components/CategorySection";
import Header from "./components/Header";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
// Listing pages
import FoodsListingPage from "./pages/FoodsListingPage";
import ElectronicsListingPage from "./pages/ElectronicsListingPage";
import ProductListingPage from "./pages/ProductListingPage";

// Profile Page
import ProfilePage from "./pages/ProfilePage";

// Contexts
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

import OrdersPage from "./pages/OrdersPage";

// Auth pages
import CustomerSignIn from "./pages/auth/customer/CustomerSignIn";
import CustomerSignUp from "./pages/auth/customer/CustomerSignUp";
import SellerSignIn from "./pages/auth/seller/SellerSignIn";
import SellerSignUp from "./pages/auth/seller/SellerSignUp";
import AdminSignIn from "./pages/auth/admin/AdminSignIn";
import AdminDashboard from "./pages/auth/admin/AdminDashboard";
import SellerDashboard from "./pages/auth/seller/SellerDashboard";
import ForgotPasswordSeller from "./pages/auth/seller/ForgotPasswordSeller";
import SellerVerifyOTP from "./pages/auth/seller/SellerVerifyOTP";

const App: React.FC = () => {
  return (
    <CartProvider>
      <AuthProvider>
        <Routes>
          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <HeroSection />
                <CategorySection />
              </>
            }
          />

          {/* Listing Pages */}
          <Route
            path="/foods"
            element={
              <>
                <Header />
                <FoodsListingPage />
              </>
            }
          />
          <Route
            path="/electronics"
            element={
              <>
                <Header />
                <ElectronicsListingPage />
              </>
            }
          />
          <Route
            path="/products"
            element={
              <>
                <Header />
                <ProductListingPage />
              </>
            }
          />

          {/* Product Details Page */}
          <Route
            path="/product/:id"
            element={
              <>
                <Header />
                <ProductDetailsPage />
              </>
            }
          />

          {/* Cart Page */}
          <Route
            path="/cart"
            element={
              <>
                <Header />
                <CartPage />
              </>
            }
          />

          {/* Checkout Page (Protected) */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Header />
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

          {/* Auth Pages */}
          <Route path="/signin/customer" element={<CustomerSignIn />} />
          <Route path="/signup/customer" element={<CustomerSignUp />} />
          <Route path="/signin/seller" element={<SellerSignIn />} />
          <Route path="/signup/seller" element={<SellerSignUp />} />
          <Route path="/signin/admin" element={<AdminSignIn />} />
          
          {/* Seller Routes */}
          <Route 
            path="/seller/dashboard" 
            element={
              <ProtectedRoute>
                <SellerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/seller/verify-otp" element={<SellerVerifyOTP />} />
          <Route path="/forgot-password/seller" element={<ForgotPasswordSeller />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Orders */}
          <Route path="/orders" element={<OrdersPage />} />

          {/* Profile Page */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Header />
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </CartProvider>
  );
};

export default App;