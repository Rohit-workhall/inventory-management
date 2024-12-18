import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductLists from "./Components/ProductList/ProductLists";
import ProductDetail from "./Components/ProductList/ProductDetail";
import Dashboard from "./Components/Dashboard/Dashboard";
import Navbar from "./Components/Navbar/Navbar";
import Orders from "./Components/Orders/Orders"; // Add this import
import Admin from "./Admin/Admin";
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/product" element={<ProductLists />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;
