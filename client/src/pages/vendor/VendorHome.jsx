import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import VendorChatbot from "../../components/VendorChatbot"; // ✅ AI Assistant Import

const VendorHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await api.get("/vendor/suppliers");
        setSuppliers(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  return (
    <div className="min-h-screen bg-[#F4FFFC] p-6">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-[#4D7111]">
          👋 Welcome, {user?.name || "Vendor"}!
        </h1>
        <p className="mt-2 text-[#1F4B2C] text-lg">
          Discover top-quality raw material suppliers tailored for your
          business.
        </p>
      </motion.div>

      {/* App Message */}
      <div className="bg-white p-4 rounded-xl shadow text-center mb-10">
        <p className="text-lg text-gray-700">
          🚀 Use StreetConnect to explore available supplier products, place
          orders effortlessly, and manage your supply chain like a pro!
        </p>
      </div>

      {/* Supplier Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex overflow-x-auto gap-4 pb-2"
      >
        {suppliers.map((supplier, index) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="min-w-[280px] bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition flex-shrink-0"
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-semibold text-[#4D7111] mb-2">
                  🏪 {supplier.name}
                </h3>
                <p className="text-sm text-gray-600">📧 {supplier.email}</p>
                <p className="text-sm text-gray-600">
                  📞 {supplier.contact || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  📍 {supplier.city || "Unknown City"}
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(`/vendor/supplier/${supplier.id}/products`)
                }
                className="mt-4 bg-[#91EAAF] text-[#1F4B2C] font-medium px-4 py-2 rounded hover:bg-[#C3E956] transition"
              >
                View Products →
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ✅ Floating AI Chatbot */}
      <VendorChatbot />
    </div>
  );
};

export default VendorHome;
