import React, { useState, useEffect } from 'react';
import { getProducts, createOrder } from './Api';
import './OrderPage.css';

const OrderPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [showPriceDetails, setShowPriceDetails] = useState(false); // To toggle price details modal
  const [orderConfirmed, setOrderConfirmed] = useState(false); // To manage Place Order button

  useEffect(() => {
    fetchProducts();
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

  const handleProceed = () => {
    if (!selectedProduct || quantity <= 0 || !email || !date) {
      alert('Please fill out all fields.');
      return;
    }
    setShowPriceDetails(true); // Show price details after clicking Proceed
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
      alert('Order placed successfully.');
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
  };

  return (
    <div className='all>'>
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
                className="order-page__input"
              />
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
              className="order-page__input"
            />
          </div>

          <div className="order-page__form-group">
            <label className="order-page__label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="order-page__input"
              placeholder="Enter your email"
            />
          </div>

          <div className="order-page__form-group">
            <label className="order-page__label">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="order-page__input"
            />
          </div>

          <button className="order-page__button" onClick={handleProceed}>
            Proceed
          </button>
        </div>

        {/* Price Details Modal */}
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