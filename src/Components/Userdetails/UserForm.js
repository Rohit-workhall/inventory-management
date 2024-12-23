import React from 'react';
import './UserForm.css';

const UserForm = ({ user, onChange, onSubmit, onCancel, isEditing }) => {
  return (
    <div className="user-form">
      <h3>{isEditing ? 'Edit User' : 'Add User'}</h3>
      
      {/* Name Field */}
      <label htmlFor="name" className="input-label">Name</label>
      <input
        type="text"
        id="name"
        className="input-field"
        placeholder="Enter your name"
        value={user.name}
        onChange={(e) => onChange('name', e.target.value)}
      />
      
      {/* Phone Number Field */}
      <label htmlFor="phone_number" className="input-label">Phone Number</label>
      <input
        type="text"
        id="phone_number"
        className="input-field"
        placeholder="Enter your phone number"
        value={user.phone_number}
        onChange={(e) => onChange('phone_number', e.target.value)}
      />
      
      {/* Email Field */}
      <label htmlFor="email" className="input-label">Email</label>
      <input
        type="email"
        id="email"
        className="input-field"
        placeholder="Enter your email"
        value={user.email}
        onChange={(e) => onChange('email', e.target.value)}
      />
      
      {/* Role Field */}
      <label htmlFor="role" className="input-label">Role</label>
      <select
        id="role"
        className="select-field"
        value={user.role}
        onChange={(e) => onChange('role', e.target.value)}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      {/* Action Buttons */}
      <div style={{ display: "flex" }}>
        <button className="action-button1" onClick={onSubmit}>
          {isEditing ? 'Update User' : 'Add User'}
        </button>
        <button className="action-button cancel1" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserForm;
