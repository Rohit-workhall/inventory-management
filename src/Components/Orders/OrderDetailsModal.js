import React from 'react';
import './OrderDetailsModal.css';

const OrderDetailsModal = ({ viewDetails, closeModal }) => {
  if (!viewDetails) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Order Delivery Details</h3>
          <button onClick={closeModal} className="modal-close-btn">×</button>
        </div>
        <div className="modal-content">
          <p><strong>Product Name:</strong> {viewDetails.productName}</p>
          <p><strong>Previous Quantity:</strong> {viewDetails.previousQuantity}</p>
          <p><strong>Ordered Quantity:</strong> {viewDetails.orderedQuantity}</p>
          <p><strong>Final Quantity:</strong> {viewDetails.finalQuantity}</p>
          <p><strong>Total Price:</strong> ${viewDetails.totalPrice}</p>
          <p><strong>Email:</strong> {viewDetails.email}</p>
          <p><strong>Date:</strong> {viewDetails.date}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
