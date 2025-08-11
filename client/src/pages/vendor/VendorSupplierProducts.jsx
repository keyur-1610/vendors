import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";

const VendorSupplierProducts = () => {
  const { supplierId } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSupplierProducts = async () => {
      try {
        const res = await api.get(`/vendor/supplier/${supplierId}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Failed to load supplier products:", err);
      }
    };

    fetchSupplierProducts();
  }, [supplierId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#4D7111]">Products by Supplier</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 shadow rounded-xl">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p>Category: {product.category}</p>
            <p>Price: ₹{product.price_per_unit}</p>
            <p>Available: {product.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorSupplierProducts;
