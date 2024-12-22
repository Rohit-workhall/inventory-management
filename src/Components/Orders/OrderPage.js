import React, { useState, useEffect } from 'react';
import { getProducts, createOrder, getUserDetails } from './Api';
import './OrderPage.css';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
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
    if (searchQuery) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchQuery, products]);

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
    setSearchQuery(product.name);
    setSelectedProduct(product);
    setFilteredProducts([]);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedProduct(null);
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
    setSearchQuery('');
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
        <h2 className="order-page__header">Place Your Order</h2>
        <div className="order-page__content">
          <div className="order-page__form">
            <div className="order-page__form-group">
              <label className="order-page__label">Product:</label>
              <div className="custom-dropdown">
                <input
                  type="text"
                  value={searchQuery}
                  placeholder="Search for a product..."
                  onChange={handleInputChange}
                  className={`order-page__input ${errors.product ? 'input-error' : ''}`}
                />
                {errors.product && <span className="error-text">{errors.product}</span>}
                {filteredProducts.length > 0 && (
                  <div className="custom-dropdown__list">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="custom-dropdown__item"
                        onMouseDown={() => handleProductSelect(product)}
                      >
                        {product.name} (Available: {product.quantity})
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
                className={`order-page__input ${errors.email ? 'input-error' : ''}`}
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
                className={`order-page__input ${errors.date ? 'input-error' : ''}`}
                readOnly
              />
              {errors.date && <span className="error-text">{errors.date}</span>}
            </div>

            <button className="order-page__button" onClick={handleProceed}>
              Proceed
            </button>
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
        </div>

        {orderConfirmed && (
          <div className="order-confirmation">
            <h3>Order Confirmed!</h3>
            <p>Your order has been successfully placed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
