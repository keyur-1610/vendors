// File: /client/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VendorDashboard from "./pages/VendorDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import SupplierHome from "./pages/supplier/SupplierHome";
import AddProduct from "./pages/supplier/AddProduct";
import SupplierProducts from "./pages/supplier/SupplierProducts";
import SupplierOrders from "./pages/supplier/SupplierOrders";

import VendorHome from "./pages/vendor/VendorHome";
import VendorProducts from "./pages/vendor/VendorProducts";
import OrderNow from "./pages/vendor/OrderNow";
import VendorOrderHistory from "./pages/vendor/VendorOrderHistory";
import VendorSupplierProducts from "./pages/vendor/VendorSupplierProducts";
import Invoice from "./pages/vendor/Invoice";

import ManageOrders from "./pages/admin/ManageOrders";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageProducts from "./pages/admin/ManageProducts";

import VendorChatbot from "./components/VendorChatbot";

// import Cart from "./pages/vendor/Cart";
import "./App.css"; // Assuming you have some global styles
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/supplier" element={<SupplierDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/supplier/home" element={<SupplierHome />} />
        <Route path="/supplier/products/add" element={<AddProduct />} />
        <Route path="/supplier/products" element={<SupplierProducts />} />
        <Route path="/supplier/orders" element={<SupplierOrders />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/products" element={<ManageProducts />} />

        <Route
          path="/vendor/supplier/:supplierId/products"
          element={<VendorSupplierProducts />}
        />
        <Route path="/vendor/invoice" element={<Invoice />} />
        <Route path="/vendor/home" element={<VendorHome />} />
        <Route path="/vendor/products" element={<VendorProducts />} />
        <Route path="/vendor/order/:id" element={<OrderNow />} />
        <Route path="/vendor/orders/history" element={<VendorOrderHistory />} />
        <Route path="/vendor/chatbot" element={<VendorChatbot />} />
        {/* <Route path="/vendor/cart" element={<Cart />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
