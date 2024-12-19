import React from "react";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose, userDetails }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={onClose}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>User Details</h2>
        </div>
        <div className="sidebar-content">
          <p><strong>Name:</strong> {userDetails.name}</p>
          <p><strong>Email:</strong> {userDetails.email}</p>
          <p><strong>Phone:</strong> {userDetails.phone_number}</p>
          <p><strong>Role:</strong> {userDetails.role}</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
