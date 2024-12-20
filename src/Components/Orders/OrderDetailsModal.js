import React, { useEffect, useRef } from "react";
import "./OrderDetailsModal.css";

const OrderDetailsModal = ({ viewDetails, closeModal }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [closeModal]);

  if (!viewDetails) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container" ref={modalRef}>
        <div className="modal-header">
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
