import React from 'react';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="form-buttons">
          <button className="button delete-btn" onClick={onConfirm}>
            Yes
          </button>
          <button className="button cancel-btn" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
