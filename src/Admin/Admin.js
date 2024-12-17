import React, { useState } from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import './Admin.css';

const Admin = () => {
  const [editingProduct, setEditingProduct] = useState(null); 
  const [showForm, setShowForm] = useState(false);

  const refreshList = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-header">Admin Dashboard</h1>
    
      <button className="button" onClick={() => {
        setEditingProduct(null); 
        setShowForm(true);
      }}>
        Add Product
      </button>

     
      <ProductList
        onEdit={(product) => {
          setEditingProduct(product);
          setShowForm(true);
        }}
      />

      {/* Product Form (Modal) */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProductForm
              mode={editingProduct ? "edit" : "add"} // Pass mode: "add" or "edit"
              product={editingProduct}
              onClose={() => setShowForm(false)}
              refreshList={refreshList}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;