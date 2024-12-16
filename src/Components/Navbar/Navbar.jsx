import React, { useState } from 'react';
import './navbar.css';

const Navbar = ({ user, onNavClick, isOpen, toggleSidebar }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="hamburger" onClick={toggleSidebar}>
          &#9776;
        </button>
        <h2>Inventory Dashboard</h2>
      </div>
      <div className="navbar-right">
        {user ? (
          <span className="user">Hello, {user}</span>
        ) : (
          <span className="user">Guest</span>
        )}
      </div>

      {/* Sidebar */}
      {isOpen && (
        <div className="sidebar">
          <ul>
            <li onClick={() => onNavClick('dashboard')}>Dashboard</li>
            <li onClick={() => onNavClick('product-list')}>Product List</li>
            <li onClick={() => onNavClick('orders')}>Orders</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
