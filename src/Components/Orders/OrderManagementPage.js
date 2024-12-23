import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, getProducts, updateProductQuantity } from './Api';
import './OrderMangementPage.css';
import OrderDetailsModal from './OrderDetailsModal'; 
import { notification } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [viewDetails, setViewDetails] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders.');
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products.');
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    try {
      const product = products.find((p) => p.id === order.productId);
      if (product) {
        const newQuantity = product.quantity + order.quantity;
        await updateProductQuantity(product.id, Math.max(newQuantity, 0));
      }

      await updateOrderStatus(orderId, 'delivered');
      notification.open({ message: 'Product delivered successfully.' });
      fetchOrders();
      fetchProducts();
    } catch (error) {
      console.error('Failed to update order status.', error);
    }
  };

  const handleViewDetails = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    const product = products.find((p) => p.id === order.productId);
    setViewDetails({
      productName: order.productName,
      previousQuantity: product.quantity - order.quantity,
      orderedQuantity: order.quantity,
      finalQuantity: product.quantity,
      totalPrice: order.totalPrice,
      email: order.email,
      date: order.date,
    });
  };

  const closeViewModal = () => {
    setViewDetails(null);
  };

  return (
    <div className="order-management">
      <div style={{display:"flex"}}>
      <ArrowLeftOutlined onClick={()=>{navigate(-1)}} style={{fontSize:"20px",margin:"10px"}} />
      <h2 className="order-management__header">Manage Orders</h2>
      </div>
      <div className="order-management__table-container">
        <table className="order-management__table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Email</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.productName}</td>
                <td>{order.quantity}</td>
                <td>${order.totalPrice}</td>
                <td>{order.email}</td>
                <td>{order.date}</td>
                <td>{order.status}</td>
                <td>
                  {order.status === 'ordered' && (
                    <button
                      className="order-management__button"
                      onClick={() => handleMarkAsDelivered(order.id)}
                    >
                      Delivered
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <button
                      className="order-management__button"
                      onClick={() => handleViewDetails(order.id)}
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderDetailsModal viewDetails={viewDetails} closeModal={closeViewModal} />
    </div>
  );
};

export default OrderManagement;

