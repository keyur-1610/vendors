import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SupplierHome = () => {
  const [orders, setOrders] = useState([]);
  const [materials, setMaterials] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, materialRes] = await Promise.all([
          api.get("/supplier/orders"),
          api.get("/supplier/materials/mine"),
        ]);
        setOrders(orderRes.data || []);
        setMaterials(materialRes.data || []);
      } catch (err) {
        console.error("Failed to load supplier dashboard data:", err);
      }
    };
    fetchData();
  }, []);

  const inStock = materials.filter((m) => m.quantity > 0);
  const outOfStock = materials.filter((m) => m.quantity <= 0);
  const pendingOrders = orders.filter((o) => o.status !== "delivered");

  return (
    <div className="min-h-screen bg-[#F4FFFC] p-6">
      {/* Animated Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-[#4D7111] mb-8"
      >
        👋 Welcome, Supplier!
      </motion.h2>

      {/* Dashboard Cards with entry animation */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {[{
          title: "📦 Pending Orders",
          value: pendingOrders.length,
          color: "#C3E956"
        }, {
          title: "✅ In-Stock Products",
          value: inStock.length,
          color: "#91EAAF"
        }, {
          title: "🚫 Out-of-Stock",
          value: outOfStock.length,
          color: "#4D7111",
          valueColor: "text-red-500"
        }].map((card, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.03 }}
            className={`bg-white border-l-4 p-6 rounded-xl shadow transition hover:shadow-lg`}
            style={{ borderColor: card.color }}
          >
            <h3 className="text-lg font-semibold text-[#4D7111] mb-2">
              {card.title}
            </h3>
            <p className={`text-4xl font-bold ${card.valueColor || "text-[#1F4B2C]"}`}>
              {card.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Animated Buttons */}
      <motion.div
        className="mt-10 flex flex-col md:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/supplier/products/add")}
          className="bg-[#C3E956] text-[#1F4B2C] font-semibold px-6 py-3 rounded-md shadow hover:bg-[#1F4B2C] hover:text-white transition"
        >
          ➕ Add New Product
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/supplier/orders")}
          className="bg-[#91EAAF] text-[#1F4B2C] font-semibold px-6 py-3 rounded-md shadow hover:bg-[#1F4B2C] hover:text-white transition"
        >
          📬 View Orders
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/supplier/products")}
          className="bg-[#1F4B2C] text-white font-semibold px-6 py-3 rounded-md shadow hover:bg-[#4D7111] transition"
        >
          📂 Manage Products
        </motion.button>
      </motion.div>
    </div>
  );
};

export default SupplierHome;
