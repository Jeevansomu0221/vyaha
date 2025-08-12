import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/vyahalogoo.png'; // Import the logo image
import './Header.css'; // Import the unique CSS file

const Header = () => {
  return (
    <header className="ecommerce-header">
      <div className="header-top-bar">
        <div className="logo-container">
          <Link to="/" className="logo-link">
            <img 
              src={logo} 
              alt="Vyaha Store Logo" 
              style={{ height: '70px', width: 'auto' }}
            />
          </Link>
        </div>
        
        <div className="search-bar-container">
          <input type="text" placeholder="Search for products..." className="search-input" />
          <button className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
        
        <nav className="user-actions">
          <Link to="/profile" className="action-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
          <Link to="/favorites" className="action-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-heart">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </Link>
          <Link to="/cart" className="action-link cart-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-cart">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </Link>
        </nav>
      </div>

      <nav className="header-main-nav">
        <ul>
          <li><Link to="/products/new-arrivals">New Arrivals</Link></li>
          <li><Link to="/products/men">Men</Link></li>
          <li><Link to="/products/women">Women</Link></li>
          <li><Link to="/products/accessories">Accessories</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
