import React from 'react';
import './UserForm.css';

const UserForm = ({ user, onChange, onSubmit, onCancel, isEditing }) => {
  return (
    <div className="user-form">
      <h3>{isEditing ? 'Edit User' : 'Add User'}</h3>
      <input
        type="text"
        className="input-field"
        placeholder="Name"
        value={user.name}
        onChange={(e) => onChange('name', e.target.value)}
      />
      <input
        type="text"
        className="input-field"
        placeholder="Phone Number"
        value={user.phone_number}
        onChange={(e) => onChange('phone_number', e.target.value)}
      />
      <input
        type="email"
        className="input-field"
        placeholder="Email"
        value={user.email}
        onChange={(e) => onChange('email', e.target.value)}
      />
      <select
        className="select-field"
        value={user.role}
        onChange={(e) => onChange('role', e.target.value)}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="super_admin">Super Admin</option>
      </select>
      <button className="action-button1" onClick={onSubmit}>
        {isEditing ? 'Update User' : 'Add User'}
      </button>
      <button className="action-button cancel1" onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default UserForm;
