import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import OrderTable from "../components/OrderTable";
import { motion } from "framer-motion";

const SupplierDashboard = () => {
  const [materials, setMaterials] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [materialsRes, ordersRes] = await Promise.all([
        api.get("/supplier/materials/mine"),
        api.get("/supplier/orders"),
      ]);
      setMaterials(materialsRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.error("❌ Dashboard fetch failed:", err);
    }
  };

  const inStock = materials.filter((m) => m.status === "in_stock");
  const outOfStock = materials.filter((m) => m.status === "out_of_stock");
  const newOrders = orders.filter((o) => o.status !== "delivered");
  const deliveredOrders = orders.filter((o) => o.status === "delivered");

  return (
    <div className="min-h-screen bg-[#F4FFFC] p-6">
      <motion.h1
        className="text-4xl font-extrabold text-[#4D7111] mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        👋 Welcome, Supplier
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[{
          title: "In-Stock Products",
          value: inStock.length,
          color: "#4D7111",
          emoji: "🟢",
        }, {
          title: "Out-of-Stock",
          value: outOfStock.length,
          color: "#B91C1C",
          emoji: "🔴",
        }, {
          title: "Total Products",
          value: materials.length,
          color: "#1F4B2C",
          emoji: "📦",
        }, {
          title: "New Orders",
          value: newOrders.length,
          color: "#7C3AED",
          emoji: "📬",
        }, {
          title: "Delivered Orders",
          value: deliveredOrders.length,
          color: "#047857",
          emoji: "✅",
        }, {
          title: "Total Orders",
          value: orders.length,
          color: "#374151",
          emoji: "📊",
        }].map((card, idx) => (
          <motion.div
            key={idx}
            className="bg-white border-l-4 p-6 rounded-xl shadow"
            style={{ borderColor: card.color }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <h3 className="text-lg font-semibold text-[#1F4B2C] mb-2">
              {card.emoji} {card.title}
            </h3>
            <p className="text-3xl font-bold" style={{ color: card.color }}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-10">
        <button
          onClick={() => navigate("/supplier/products/add")}
          className="bg-[#91EAAF] text-[#1F4B2C] px-5 py-3 rounded-lg font-semibold hover:bg-[#C3E956]"
        >➕ Add Product</button>
        <button
          onClick={() => navigate("/supplier/products")}
          className="bg-[#4D7111] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#3B5D0C]"
        >📦 Manage Products</button>
        <button
          onClick={() => navigate("/supplier/orders")}
          className="bg-[#1F4B2C] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#163E26]"
        >📬 View All Orders</button>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#4D7111] mb-4">📬 Recent Orders</h2>
        {orders.length > 0 ? (
          <OrderTable orders={orders.slice(0, 5)} />
        ) : (
          <p className="text-gray-600">No orders received yet.</p>
        )}
      </div>
    </div>
  );
};

export default SupplierDashboard;