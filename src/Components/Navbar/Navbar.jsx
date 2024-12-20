import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar"; 
import axios from "axios"; 
import "./navbar.css";

const Navbar = ({ onSignOut }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOrdersDropdownOpen, setIsOrdersDropdownOpen] = useState(false); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [userDetails, setUserDetails] = useState(null); 
  const Role = localStorage.getItem("Role");

  const dropdownRef = useRef(null); 

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleOrdersDropdown = () => {
    setIsOrdersDropdownOpen(!isOrdersDropdownOpen);
  };

  const fetchUserDetails = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No user logged in");

      const response = await axios.get(
        `http://localhost:5000/api/user-details/${userId}`
      );
      setUserDetails(response.data);
    } catch (error) {
      console.error("Failed to fetch user details:", error.message);
    }
  };

  const viewProfile = () => {
    setIsSidebarOpen(true); // Open the sidebar
  };

  const userName = userDetails ? userDetails.name : "User";
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
                <Link to="/" onClick={() => setIsNavOpen(false)}>
                  Dashboard
                </Link>
              </li>
              {Role === "admin" && (
                <li
                  className="dropdown-trigger"
                  onMouseLeave={() => setIsOrdersDropdownOpen(false)}
                >
                  <span onMouseEnter={toggleOrdersDropdown}>Orders</span>
                  {isOrdersDropdownOpen && (
                    <div className="dropdown orders-dropdown">
                      <div className="dropdown-item">
                        <Link
                          to="/orders/place"
                          onClick={() => setIsOrdersDropdownOpen(false)}
                        >
                          Place Orders
                        </Link>
                      </div>
                      <div className="dropdown-item">
                        <Link
                          to="/orders/manage"
                          onClick={() => setIsOrdersDropdownOpen(false)}
                        >
                          Manage Orders
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              )}
              <li>
                <Link to="/StockManagement">Stock Management</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="navbar-right">
          <div
            className="user-container"
            ref={dropdownRef}
            onClick={toggleDropdown}
          >
            <div className="user-circle">{userInitial}</div>
            {isDropdownOpen && (
              <div className="dropdown">
                <div className="dropdown-item user-info" onClick={viewProfile}>
                  <div className="user-circle dropdown-circle">
                    {userInitial}
                  </div>
                  <span className="user-name">{userName}</span>
                </div>
                <div className="dropdown-item logout" onClick={onSignOut}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isNavOpen && <div className="overlay" onClick={toggleNav}></div>}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userDetails={userDetails || {}}
      />
    </div>
  );
};

export default Navbar;

