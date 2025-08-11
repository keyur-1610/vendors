import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { motion } from "framer-motion";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api
      .get("/admin/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("❌ Failed to fetch orders:", err));
  }, []);

  const getStatusBadge = (status) => {
    const base = "capitalize px-2 py-1 text-xs rounded font-medium";
    switch (status) {
      case "pending":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "completed":
        return `${base} bg-green-100 text-green-700`;
      case "canceled":
        return `${base} bg-red-100 text-red-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FFFC] p-6">
      <motion.h1
        className="text-3xl font-extrabold text-[#4D7111] mb-8 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📜 Admin – Manage Orders
      </motion.h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-[#91EAAF]">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#91EAAF] text-[#1F4B2C]">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Vendor</th>
              <th className="p-3">Product</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Total (₹)</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t hover:bg-[#F4FFFC] transition duration-150"
                >
                  <td className="p-3 font-semibold text-[#4D7111]">#{o.id}</td>
                  <td className="p-3">{o.vendor_name}</td>
                  <td className="p-3">{o.material_name}</td>
                  <td className="p-3">{o.quantity}</td>
                  <td className="p-3">₹{o.total_price}</td>
                  <td className="p-3">
                    <span className={getStatusBadge(o.status)}>{o.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
