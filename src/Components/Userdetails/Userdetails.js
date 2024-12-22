import React, { useState, useEffect } from 'react';
import './Userdetails.css';
import UserForm from './UserForm';

const API_URL = 'http://localhost:5000/api/manage-users';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentUser, setCurrentUser] = useState({ name: '', phone_number: '', email: '', role: 'user' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleFormChange = (field, value) => {
    setCurrentUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = async () => {
    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser ? `${API_URL}/${editingUser._id}` : API_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUser),
      });
      if (!response.ok) throw new Error('Failed to save user');
      fetchUsers();
      handleFormClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setCurrentUser(user);
    setFormVisible(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleFormClose = () => {
    setEditingUser(null);
    setCurrentUser({ name: '', phone_number: '', email: '', role: 'user' });
    setFormVisible(false);
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <button className="action-button" onClick={() => setFormVisible(true)}>
        Add User
      </button>
      
      {formVisible && (
        <div className="modal">
          <div className="modal-content">
            <UserForm
              user={currentUser}
              onChange={handleFormChange}
              onSubmit={handleFormSubmit}
              onCancel={handleFormClose}
              isEditing={!!editingUser}
            />
          </div>
        </div>
      )}

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.phone_number}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="action-button" onClick={() => handleEditUser(user)}>Edit</button>
                <button className="action-button delete" onClick={() => handleDeleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
