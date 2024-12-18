import React, { useState } from 'react';
import './navbar.css';

const Navbar = ({ onNavClick }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="navbar-left">
          <button className="hamburger" onClick={toggleNav}>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          <h2 className="brand">Stock<span className="highlight">Wise</span></h2>
          <div className={`navbar-links ${isNavOpen ? 'open' : ''}`}>
            <ul>
              <li >DashBoard</li>
              <li onClick={() => onNavClick('product-list')}>Product List</li>
              <li onClick={() => onNavClick('orders')}>Orders</li>
              <li onClick={() => onNavClick('admin')}>Admin</li>
            </ul>
          </div>
        </div>
        <div className="navbar-right">
          <span className="user">Hello, <strong>User</strong></span>
        </div>
      </div>
      {isNavOpen && <div className="overlay" onClick={toggleNav}></div>}
    </div>
  );
};

export default Navbar;