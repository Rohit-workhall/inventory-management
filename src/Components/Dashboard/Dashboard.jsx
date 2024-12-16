import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Orders from '../Orders/Orders';
import './dashboard.css';
import '../../Components/Navbar/navbar.css';
import productData from '../../Products/Products.json';
import ProductLists from '../ProductList/ProductLists';

const Dashboard = () => {
  const [user, setUser] = useState('John Doe');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Track sidebar state

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const totalProducts = productData.products.length;
  const lowStockItems = productData.products.filter(item => item.quantity <= 10).length;
  const outOfStockItems = productData.products.filter(item => item.quantity === 0).length;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <div className="metrics">
            <div className="metric">
              <h3>Total Products</h3>
              <p>{totalProducts}</p>
            </div>
            <div className="metric">
              <h3>Low Stock Items</h3>
              <p>{lowStockItems}</p>
            </div>
            <div className="metric">
              <h3>Out of Stock Items</h3>
              <p>{outOfStockItems}</p>
            </div>
          </div>
        );
      case 'product-list':
        return <ProductLists />;
      case 'orders':
        return <Orders />;
      default:
        return <div>Select a page from the menu</div>;
    }
  };

  return (
    <div className={`dashboard ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar user={user} onNavClick={setCurrentPage} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {renderPage()}
    </div>
  );
};

export default Dashboard;
