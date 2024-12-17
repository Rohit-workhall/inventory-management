import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from './Api';
import ConfirmationModal from './ConfirmationModal';

const ProductList = ({ onEdit }) => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.log('Failed to fetch products.');
    }
  };

  const confirmDelete = (id) => {
    setSelectedProductId(id);
    setShowModal(true); // Show the modal
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProductId);
      console.log('Product deleted successfully.');
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.log('Failed to delete product.');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProductId(null);
  };

  return (
    <>
      <table className="product-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.name}</td>
              <td>{product.sku}</td>
              <td>{product.quantity}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.category}</td>
              <td>
              <td className="actions">
  <button className="button" onClick={() => onEdit(product)}>Edit</button>
  <button className="button delete-btn" onClick={() => confirmDelete(product.id)}>Delete</button>
</td>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render Confirmation Modal */}
      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete this product?"
          onConfirm={handleDelete}
          onCancel={closeModal}
        />
      )}
    </>
  );
};

export default ProductList;
