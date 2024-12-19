import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductLists from "./Components/ProductList/ProductLists";
import ProductDetail from "./Components/ProductList/ProductDetail";
import Dashboard from "./Components/Dashboard/Dashboard";
import Navbar from "./Components/Navbar/Navbar";
import Orders from "./Components/Orders/Orders";
import Admin from "./Admin/Admin";
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
    setIsLoggedIn(false);
  };

  return (
   <>
   <OrderPage/>
   <OrderManagement/>
   </>
  );
};

export default App;
