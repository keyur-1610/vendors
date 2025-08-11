import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/vendor/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch products:", err);
    }
  };

  const handleOrder = (product) => {
    navigate(`/vendor/order/${product.id}`, { state: { product } });
  };

  return (
    <div className="min-h-screen bg-[#F4FFFC] py-8 px-4 md:px-10">
      {/* Title */}
      <motion.h2
        className="text-4xl font-extrabold text-center text-[#4D7111] mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🛍️ Explore Fresh Supplies
      </motion.h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden border border-[#91EAAF]"
          >
            <div className="p-5 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-xl font-bold text-[#4D7111] mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  🗂 Category:{" "}
                  <span className="font-medium">{product.category}</span>
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  💸 Price: ₹{product.price_per_unit}/unit
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  📦 Available: {product.quantity} units
                </p>
                <p className="text-sm text-gray-500 italic mb-2">
                  🏪 Supplier: <strong>{product.supplier_name}</strong>
                </p>
              </div>

              <button
                onClick={() => handleOrder(product)}
                className="mt-4 w-full bg-[#91EAAF] text-[#1F4B2C] py-2 rounded-md font-semibold hover:bg-[#C3E956] transition"
              >
                🛒 Order Now
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VendorProducts;
