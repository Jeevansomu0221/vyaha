import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Contact Section */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@yourstore.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: 123, Fashion Street, Mumbai, India</p>
        </div>

        {/* Become a Seller */}
        <div className="footer-section">
          <h3>Sell With Us</h3>
          <p>Grow your business by selling on our platform.</p>
          <button className="footer-btn">Become a Seller</button>
        </div>

        {/* Company Info */}
        <div className="footer-section">
          <h3>About</h3>
          <ul>
            <li>About Us</li>
            <li>Careers</li>
            <li>Press</li>
            <li>Blog</li>
          </ul>
        </div>

        {/* Help Section */}
        <div className="footer-section">
          <h3>Help</h3>
          <ul>
            <li>FAQ</li>
            <li>Returns</li>
            <li>Shipping</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#">🌐</a>
            <a href="#">📘</a>
            <a href="#">🐦</a>
            <a href="#">📸</a>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-section">
          <h3>Subscribe</h3>
          <p>Get updates on the latest offers and trends.</p>
          <div className="newsletter">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} YourStore. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
