import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductLists from "./Components/ProductList/ProductLists";
import ProductDetail from "./Components/ProductList/ProductDetail";
import Dashboard from "./Components/Dashboard/Dashboard";
import Navbar from "./Components/Navbar/Navbar";
import Orders from "./Components/Orders/Orders";
import Admin from "./Admin/Admin";
import Auth from "./Components/Auth/Auth"; // Import the Auth page

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
            <Route path="/product" element={<ProductLists />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/orders" element={<Orders />} />
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
