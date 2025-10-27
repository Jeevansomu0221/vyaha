import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/vyahalogoo.png";
import "./Header.css";
import { useAuth } from "../context/AuthContext"; // ✅ import auth

const Header: React.FC = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth(); // ✅ get user + logout
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clear user + localStorage
    navigate("/"); // redirect home
  };

  return (
    <header className="ecommerce-header">
      <div className="header-top-bar">
        {/* Logo */}
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Vyaha Store Logo" style={{ height: "70px" }} />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/products">Cloths</Link>
          <Link to="/electronics">Electronics</Link>
          <Link to="/foods">Foods</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/customer-care">Customer Care</Link>
        </nav>

        {/* Search */}
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search for products..."
            className="search-input"
          />
          <button className="search-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        {/* User actions */}
        <nav className="user-actions">
          <div
            className="profile-wrapper"
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <Link to="#" className="action-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-user"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div
                className="dropdown-container"
                onMouseEnter={() => setShowProfileMenu(true)}
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="dropdown-connector"></div>
                <div className="profile-dropdown">
                  {!user ? (
                    <>
                      <h4>Sign In</h4>
                      <Link to="/signin/customer" className="dropdown-btn">
                        Customer
                      </Link>
                      <Link to="/signin/seller" className="dropdown-btn">
                        Seller
                      </Link>
                      <Link to="/signin/admin" className="dropdown-btn">
                        Admin
                      </Link>

                      <h4>Sign Up</h4>
                      <Link to="/signup/customer" className="dropdown-btn">
                        Customer
                      </Link>
                      <Link to="/signup/seller" className="dropdown-btn">
                        Seller
                      </Link>
                    </>
                  ) : (
                    <>
                      <h4>Welcome</h4>
                      <p style={{ margin: "5px 0" }}>{user.email}</p>
                      <button
                        className="dropdown-btn"
                        onClick={handleLogout}
                      >
                        Sign Out
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link to="/favorites" className="action-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-heart"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="action-link cart-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-shopping-cart"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
