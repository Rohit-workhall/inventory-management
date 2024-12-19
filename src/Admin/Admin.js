import React, { useState } from "react";
import ProductForm from "./ProductForm";
import "./Admin.css";
import ProductLists from "../Components/ProductList/ProductLists";

const Admin = () => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const refreshList = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="admin-container">
     
      <div className="toolbar">
        
        <ProductLists
          onEdit={(product) => {
            setEditingProduct(product);
            setShowForm(true);
          }}
        />
      </div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProductForm
              mode={editingProduct ? "edit" : "add"}
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
