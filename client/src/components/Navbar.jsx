import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center relative">
      <h1 className="font-bold text-xl text-blue-700">StreetConnect</h1>

      <div className="space-x-4 flex items-center relative">
        {!user ? (
          <>
            <Link to="/" className="text-blue-600">Login</Link>
            <Link to="/register" className="text-blue-600">Register</Link>
          </>
        ) : (
          <>
            <span className="text-gray-700">Hello, <strong>{user.name}</strong></span>

            {/* Vendor Navigation */}
            {role === "vendor" && (
              <>
                <Link to="/vendor/home" className="text-blue-600">Home</Link>
                <Link to="/vendor/products" className="text-blue-600">Products</Link>
                <Link to="/profile" className="text-blue-600">Profile</Link>
                <Link to="/vendor" className="text-blue-600">Dashboard</Link>
                <Link to="/vendor/orders/history" className="text-blue-600">Order History</Link>
              </>
            )}

            {/* Supplier Navigation */}
            {role === "supplier" && (
              <>
                <Link to="/supplier/home" className="text-green-600">Home</Link>
                <Link to="/supplier" className="text-green-600">Dashboard</Link>
                <Link to="/supplier/orders" className="text-green-600">Orders</Link>

                <div className="relative inline-block">
                  <button
                    onClick={toggleDropdown}
                    className="text-green-600 focus:outline-none"
                  >
                    Products ▾
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-10 bg-white border shadow rounded mt-2 w-40">
                      <Link
                        to="/supplier/products"
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                      >
                        📂 My Products
                      </Link>
                      <Link
                        to="/supplier/products/add"
                        onClick={closeDropdown}
                        className="block px-4 py-2 text-sm text-green-700 hover:bg-gray-100"
                      >
                        ➕ Add Product
                      </Link>
                    </div>
                  )}
                </div>

                <Link to="/profile" className="text-green-600">Profile</Link>
              </>
            )}

            {/* Admin Navigation */}
            {role === "admin" && (
              <Link to="/admin" className="text-red-600">Admin Dashboard</Link>
            )}

            <button
              onClick={handleLogout}
              className="text-red-500 hover:underline"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
