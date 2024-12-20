import React from "react";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose, userDetails }) => {
  return (
    <>
      {isOpen && <div className="overlay" onClick={onClose}></div>}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 style={{color:"white", textAlign: "center"}}>User Details</h2>
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
