import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = ({ onSignOut }) => {
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
          <h2 className="brand">
            Stock<span className="highlight">Wise</span>
          </h2>
          <div className={`navbar-links ${isNavOpen ? "open" : ""}`}>
            <ul>
              <li>
                <Link to="/" onClick={() => setIsNavOpen(false)}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/product" onClick={() => setIsNavOpen(false)}>
                  Product List
                </Link>
              </li>
              <li>
                <Link to="/orders" onClick={() => setIsNavOpen(false)}>
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/admin" onClick={() => setIsNavOpen(false)}>
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-right">
          <span className="user">
            Hello, <strong>User</strong>
          </span>
          <button className="signout-button" onClick={onSignOut}>
            Sign Out
          </button>
        </div>
      </div>
      {isNavOpen && <div className="overlay" onClick={toggleNav}></div>}
    </div>
  );
};

export default Navbar;
