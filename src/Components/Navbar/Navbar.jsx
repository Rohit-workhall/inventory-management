import React, { useState } from 'react';
import './navbar.css';

const Navbar = ({ user, onNavClick, isOpen, toggleSidebar }) => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <button className="hamburger" onClick={toggleSidebar}>
          &#9776;
        </button>
        <h2>Inventory Management</h2>
      </div>
      <div className="navbar-right">
        {user ? (
          <span className="user">Hello, {user}</span>
        ) : (
          <span className="user">Profile</span>
        )}
      </div>

      
      {isOpen && (
        <div className="sidebar">
          <ul>
            <li onClick={() => onNavClick('dashboard')}>Dashboard</li>
            <li onClick={() => onNavClick('product-list')}>Product List</li>
            <li onClick={() => onNavClick('orders')}>Orders</li>
            <li onClick={() => onNavClick('admin')}>Admin</li>
            
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
