// OrderManagementPage.js
import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, getProducts, updateProductQuantity } from './Api';
import { Table, Button, notification, Input, Space } from 'antd';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import OrderDetailsModal from './OrderDetailsModal';
import './OrderMangementPage.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [viewDetails, setViewDetails] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  useEffect(() => {
    handleSearch(searchText);
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
      setFilteredOrders(data);
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
      notification.success({ message: 'Product delivered successfully.' });
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

  const handleSearch = (value) => {
    setSearchText(value);
    const filteredData = orders.filter(
      (order) =>
        order.productName.toLowerCase().includes(value.toLowerCase()) ||
        order.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOrders(filteredData);
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      sorter: (a, b) => a.productName.localeCompare(b.productName),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Product"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                confirm();
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.productName.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `$${price}`,
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Ordered', value: 'ordered' },
        { text: 'Delivered', value: 'delivered' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div>
          {record.status === 'ordered' && (
            <Button
              type="primary"
              onClick={() => handleMarkAsDelivered(record.id)}
            >
              Delivered
            </Button>
          )}
          {record.status === 'delivered' && (
            <Button onClick={() => handleViewDetails(record.id)}>
              View
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="order-management">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ArrowLeftOutlined
          onClick={() => navigate(-1)}
          style={{ fontSize: '20px', margin: '10px' }}
        />
        <h2 className="order-management__header">Manage Orders</h2>
      </div>
      <Input
        placeholder="Search orders by product or email"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
        allowClear
      />
      <Table
        className="order-management__table"
        dataSource={filteredOrders}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'calc(700px + 40%)' }}
      />
      <OrderDetailsModal viewDetails={viewDetails} closeModal={closeViewModal} />
    </div>
  );
};

export default OrderManagement;
