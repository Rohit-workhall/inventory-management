import React, { useState, useEffect } from 'react';
import { getProducts, createOrder, getUserDetails } from './Api';
import './OrderPage.css';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const OrderPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState({});
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    populateDate();
    fetchUserEmail();
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [selectedProduct, quantity]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products.');
    }
  };

  const fetchUserEmail = async () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        const userDetails = await getUserDetails(userId);
        setEmail(userDetails.email);
      } catch (error) {
        console.error('Failed to fetch user details.');
      }
    }
  };

  const populateDate = () => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const calculatePrice = () => {
    if (selectedProduct) {
      setTotalPrice((selectedProduct.price * quantity).toFixed(2));
    } else {
      setTotalPrice(0);
    }
  };

  const validateFields = () => {
    const validationErrors = {};

    if (!selectedProduct) validationErrors.product = 'Please select a product.';
    if (!quantity || quantity <= 0) validationErrors.quantity = 'Quantity must be at least 1.';
    if (!email || !/\S+@\S+\.\S+/.test(email)) validationErrors.email = 'Please enter a valid email.';
    if (!date) validationErrors.date = 'Please select a date.';

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const handleProceed = () => {
    if (validateFields()) {
      setShowPriceDetails(true);
    }
  };

  const handleOrder = async () => {
    const order = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity,
      totalPrice: Number(totalPrice),
      status: 'ordered',
      email,
      date,
    };

    try {
      await createOrder(order);
      notification.open({ message: 'Ordered Successfully' });
      navigate('/');
      setOrderConfirmed(true);
      resetForm();
    } catch (error) {
      console.error('Failed to place order.', error);
    }
  };

  const resetForm = () => {
    setQuantity(1);
    setTotalPrice(0);
    setSelectedProduct(null);
    setEmail('');
    setDate('');
    setShowPriceDetails(false);
    setOrderConfirmed(false);
    setErrors({});
  };

  return (
    <div className="all1">
      <div className="order-page">
        <div className="order-page__header-container">
          <ArrowLeftOutlined
            onClick={() => {
              navigate(-1);
            }}
          />
          <h2 className="order-page__header">Place Your Order</h2>
        </div>
        <div className="order-page__content">
          <div className="order-page__form">
            <div className="order-page__form-group">
              <label className="order-page__label">Product:</label>
              <select
                value={selectedProduct?.id || ''}
                onChange={(e) => {
                  const productId = e.target.value;
                  const product = products.find((p) => p.id === productId);
                  handleProductSelect(product);
                }}
                className={`order-page__select ${errors.product ? 'input-error' : ''}`}
              >
                <option value="" disabled>
                  Select a product...
                </option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} (Available: {product.quantity})
                  </option>
                ))}
              </select>
              {errors.product && <span className="error-text">{errors.product}</span>}
            </div>

            <div className="order-page__form-group">
              <label className="order-page__label">Quantity:</label>
              <input
                type="number"
                value={quantity}
                min="1"
                onChange={(e) => setQuantity(Number(e.target.value))}
                className={`order-page__input ${errors.quantity ? 'input-error' : ''}`}
              />
              {errors.quantity && <span className="error-text">{errors.quantity}</span>}
            </div>

            <div className="order-page__form-group">
              <label className="order-page__label">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`order-page__input1 ${errors.email ? 'input-error' : ''}`}
                placeholder="Enter your email"
                readOnly
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="order-page__form-group">
              <label className="order-page__label">Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`order-page__input1 ${errors.date ? 'input-error' : ''}`}
                readOnly
              />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>

            <div className="order-page__buttons">
            <button className="order-page__button-proceed" onClick={handleProceed}>
                Proceed
              </button>
              {/* <button className="order-page__button-back" onClick={() => navigate(-1)}>
                Back
              </button> */}
              
            </div>
          </div>

          {showPriceDetails && (
            <div className="price-details-modal">
              <div className="price-details-modal__content">
                <h3 className="price-details-modal__header">Price Details</h3>
                {selectedProduct && (
                  <>
                    <div className="order-page__price-item">
                      <span>Product Name:</span>
                      <span>{selectedProduct.name}</span>
                    </div>
                    <div className="order-page__price-item">
                      <span>Category:</span>
                      <span>{selectedProduct.category}</span>
                    </div>
                    <div className="order-page__price-item">
                      <span>Price per Unit:</span>
                      <span>${selectedProduct.price.toFixed(2)}</span>
                    </div>
                    <div className="order-page__price-item">
                      <span>Quantity:</span>
                      <span>{quantity}</span>
                    </div>
                    <div className="order-page__price-item">
                      <span>Total Price:</span>
                      <span>${totalPrice}</span>
                    </div>
                  </>
                )}
                <button
                  className="order-page__button--place-order"
                  onClick={handleOrder}
                >
                  Place Order
                </button>
                <button
                  className="order-page__button--cancel"
                  onClick={() => setShowPriceDetails(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {orderConfirmed && (
            <div className="order-confirmation">
              <h3>Order Confirmed!</h3>
              <p>Your order has been successfully placed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
