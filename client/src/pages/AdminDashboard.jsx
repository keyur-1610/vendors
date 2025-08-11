import React, { useEffect, useState } from "react";
import api from "../api/api";
import {
  Users,
  PackageCheck,
  ShoppingCart,
  LogOut,
  LayoutDashboard,
  Store,
  Truck,
  ClipboardList,
  Box,
} from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    vendors: 0,
    suppliers: 0,
    orders: 0,
    materials: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("❌ Failed to load dashboard stats:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const cards = [
    {
      title: "Total Vendors",
      count: stats.vendors,
      color: "text-blue-600",
      icon: <Store size={24} />,
    },
    {
      title: "Total Suppliers",
      count: stats.suppliers,
      color: "text-green-600",
      icon: <Truck size={24} />,
    },
    {
      title: "Total Orders",
      count: stats.orders,
      color: "text-purple-600",
      icon: <ClipboardList size={24} />,
    },
    {
      title: "Total Materials",
      count: stats.materials,
      color: "text-yellow-600",
      icon: <Box size={24} />,
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-red-600 mb-8">Admin Panel</h2>
          <nav className="space-y-5 text-sm font-medium text-gray-700">
            <a
              href="/admin"
              className="flex items-center gap-3 hover:text-red-600"
            >
              <LayoutDashboard size={18} /> Dashboard
            </a>
            <a
              href="/admin/users"
              className="flex items-center gap-3 hover:text-red-600"
            >
              <Users size={18} /> Manage Users
            </a>
            <a
              href="/admin/products"
              className="flex items-center gap-3 hover:text-red-600"
            >
              <PackageCheck size={18} /> Manage Products
            </a>
            <a
              href="/admin/orders"
              className="flex items-center gap-3 hover:text-red-600"
            >
              <ShoppingCart size={18} /> Manage Orders
            </a>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Dashboard */}
      <main className="flex-1 p-10">
        <motion.h1
          className="text-4xl font-bold text-red-700 mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          📊 Admin Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-all border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`text-lg font-semibold ${card.color}`}>
                  {card.title}
                </div>
                <div className="text-gray-400">{card.icon}</div>
              </div>
              <h2 className={`text-3xl font-bold ${card.color}`}>
                {card.count}
              </h2>
              <p className="text-sm text-gray-400 mt-1">as of now</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
