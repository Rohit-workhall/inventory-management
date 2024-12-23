import React, { useState, useEffect } from 'react';
import './Userdetails.css';
import UserForm from './UserForm';
import { notification } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/manage-users';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [currentUser, setCurrentUser] = useState({ name: '', phone_number: '', email: '', role: 'user' });
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const filteredUsers = data.filter(user => user.role !== 'super_admin');
      setUsers(filteredUsers);
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
      notification.open({message:"User Details has been Updated Successfully"});
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setCurrentUser(user);
    setFormVisible(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteUserId(id);
    setShowConfirmDelete(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await fetch(`${API_URL}/${deleteUserId}`, { method: 'DELETE' });
      fetchUsers();
      notification.open({message:"User has been Deleted Successfully"});
    } catch (error) {
      console.error('Failed to delete user:', error);
      notification.open({message:"Failed to Deleted the User"});
    } finally {
      setShowConfirmDelete(false);
      setDeleteUserId(null);
    }
  };

  const cancelDeleteUser = () => {
    setShowConfirmDelete(false);
    setDeleteUserId(null);
  };

  const handleFormClose = () => {
    setEditingUser(null);
    setCurrentUser({ name: '', phone_number: '', email: '', role: 'user' });
    setFormVisible(false);
  };

  return (
    <div className="user-management">
      <ArrowLeftOutlined onClick={()=>{navigate(-1)}} style={{fontSize:"20px"}} />
      <h2>User Management</h2>
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

      {showConfirmDelete && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this user?</p>
            <div style={{display:"flex"}}>
              <button className="action-button" onClick={confirmDeleteUser}>Yes</button>
              <button className="action-button delete" onClick={cancelDeleteUser}>No</button>
            </div>
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
                <button className="action-button delete1" onClick={() => handleDeleteClick(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
