import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Trash2 } from "lucide-react";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    api
      .get("/admin/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("❌ Failed to fetch products:", err));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await api.delete(`/admin/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Product deleted successfully.");
    } catch (err) {
      console.error("❌ Failed to delete product:", err);
      alert("❌ Failed to delete product.");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#F9FAFB]">
      <h1 className="text-3xl font-bold text-[#4D7111] mb-8">
        📦 Manage Products
      </h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-[#91EAAF] text-[#1F4B2C] text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3">Product Name</th>
              <th className="px-6 py-3">Supplier</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Available Qty</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr
                key={product.id}
                className={`border-b transition duration-200 ${
                  i % 2 === 0 ? "bg-white" : "bg-[#F4FFFC]"
                } hover:bg-[#e7f7ef]`}
              >
                <td className="px-6 py-4 font-medium">{product.name}</td>
                <td className="px-6 py-4">{product.supplier_name}</td>
                <td className="px-6 py-4">₹{product.price_per_unit}</td>
                <td className="px-6 py-4">{product.quantity}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="inline-flex items-center bg-red-500 text-white px-3 py-1.5 rounded-md text-sm hover:bg-red-600 transition"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center text-gray-500 py-6 italic"
                >
                  No products available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
