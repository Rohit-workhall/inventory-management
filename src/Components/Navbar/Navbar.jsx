import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Add your logout logic here
    console.log("User logged out");
  };

  const userName = "User"; // Replace with dynamic user name
  const userInitial = userName.charAt(0).toUpperCase();

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
                <Link to="/">Dashboard</Link>
              </li>
              <li>
                <Link to="/product">Product List</Link>
              </li>
              <li>
                <Link to="/orders">Orders</Link>
              </li>
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-right">
          <div className="user-container" onClick={toggleDropdown}>
            <div className="user-circle">{userInitial}</div>
            {isDropdownOpen && (
              <div className="dropdown">
                <div className="dropdown-item user-info">
                  <div className="user-circle dropdown-circle">{userInitial}</div>
                  <span className="user-name">{userName}</span>
                </div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  {/* <i className="logout-icon">\uD83D\uDD12</i>  */}
                  <FontAwesomeIcon icon="fas fa-sign-out" />Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isNavOpen && <div className="overlay" onClick={toggleNav}></div>}
    </div>
  );
};

export default Navbar;
