import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductLists from "./Components/ProductList/ProductLists";
import ProductDetail from "./Components/ProductList/ProductDetail";
import Dashboard from "./Components/Dashboard/Dashboard";
import Navbar from "./Components/Navbar/Navbar";

import Admin from "./Admin/Admin";
import Auth from "./Components/Auth/Auth";
import OrderPage from "./Components/Orders/OrderPage";
import OrderManagementPage from "./Components/Orders/OrderManagementPage";
const App = () => {
  return (
    // <Router>
    //   {/* <Navbar />
    //   <Routes>
    //     <Route path="/" element={<Dashboard />} />
    //     <Route path="/product" element={<ProductLists />} />
    //     <Route path="/product/:productId" element={<ProductDetail />} />
    //     <Route path="/orders" element={<Orders />} />
    //     <Route path="/admin" element={<Admin />} />
    //   </Routes> */}
    // </Router>
    <>
   
    <OrderPage/>
    
    <br/>
    
    </>

   
  );
};

export default App;
