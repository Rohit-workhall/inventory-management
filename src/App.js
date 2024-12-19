import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductDetail from "./Components/ProductList/ProductDetail";
import Dashboard from "./Components/Dashboard/Dashboard";
import Navbar from "./Components/Navbar/Navbar";
import OrderPage from "./Components/Orders/OrderPage";
import Admin from "./Admin/Admin";
import OrderManagement from "./Components/Orders/OrderManagementPage";
import Auth from "./Components/Auth/Auth"; // Import the Auth page
import OrderPage from "./Components/Orders/OrderPage";
import OrderManagement from "./Components/Orders/OrderManagementPage";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is already logged in (on page load)
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsLoggedIn(!!userId); // Convert userId to a boolean
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("userId"); // Clear the logged-in user
    localStorage.removeItem("Role");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      {isLoggedIn ? (
        <>
          <Navbar onSignOut={handleSignOut} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/orders/place" element={<OrderPage/>} />
            <Route path="/orders/manage" element={<OrderManagement/>}></Route>
            <Route path="/StockManagement" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/auth" element={<Auth setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
