import React, { useEffect, useState } from "react";
import api from "../api/api";
import MaterialCard from "../components/MaterialCard";
import OrderTable from "../components/OrderTable";
import { motion } from "framer-motion";

const VendorDashboard = () => {
  const [materials, setMaterials] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [materialsRes, ordersRes] = await Promise.all([
          api.get("/vendor/products"),
          api.get("/vendor/orders/history"),
        ]);
        setMaterials(materialsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error("❌ Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F4FFFC] py-8 px-6">
      <motion.h1
        className="text-4xl font-extrabold text-[#4D7111] mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🛍️ Vendor Dashboard
      </motion.h1>

      {loading ? (
        <p className="text-gray-500">Loading data...</p>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-[#1F4B2C] mb-4">Available Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {materials.length > 0 ? (
                materials.map((mat) => (
                  <MaterialCard key={mat.id} material={mat} showOrderBtn={true} />
                ))
              ) : (
                <p className="text-gray-500">No products available right now.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#1F4B2C] mb-4">My Orders</h2>
            {orders.length > 0 ? (
              <OrderTable orders={orders} />
            ) : (
              <p className="text-gray-500">No orders placed yet.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default VendorDashboard;
