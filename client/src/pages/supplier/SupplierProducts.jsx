import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { motion } from "framer-motion";

const SupplierProducts = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/supplier/materials/mine");
      setProducts(res.data || []);
    } catch (err) {
      console.error("❌ Error loading products", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/supplier/materials/${id}`);
      fetchProducts();
    } catch (err) {
      alert("❌ Failed to delete product");
    }
  };

  const handleEdit = (id) => setEditId(id);

  const handleEditChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleEditSave = async (product) => {
    try {
      await api.put(`/supplier/materials/${product.id}`, {
        name: product.name,
        quantity: Number(product.quantity),
        price_per_unit: Number(product.price_per_unit),
        category: product.category,
        status: product.status,
      });
      setEditId(null);
      fetchProducts();
      alert("✅ Product updated");
    } catch (err) {
      alert("❌ Update failed");
    }
  };

  const filtered = products.filter((p) =>
    filter === "in" ? p.status === "in_stock" :
    filter === "out" ? p.status === "out_of_stock" :
    true
  );

  return (
    <div className="min-h-screen bg-[#F4FFFC] p-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-[#4D7111] mb-6"
      >
        📦 My Products
      </motion.h2>

      {/* Filter Buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { label: "All", value: "all" },
          { label: "In Stock", value: "in" },
          { label: "Out of Stock", value: "out" },
        ].map(({ label, value }) => {
          const isActive = filter === value;
          const baseClass = "px-4 py-2 rounded-full font-medium shadow-md transition";
          const activeClass = "bg-[#91EAAF] text-[#1F4B2C]";
          const inactiveClass = "bg-white text-[#4D7111] border border-[#91EAAF] hover:bg-[#C3E956] hover:text-[#1F4B2C]";

          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="overflow-x-auto bg-white rounded-lg shadow-md"
      >
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#91EAAF] text-[#1F4B2C]">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Price/Unit</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <motion.tr
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b hover:bg-[#F4FFFC]"
              >
                {editId === p.id ? (
                  <>
                    {["name", "quantity", "price_per_unit", "category"].map((field) => (
                      <td className="p-2" key={field}>
                        <input
                          value={p[field]}
                          type={field.includes("price") || field === "quantity" ? "number" : "text"}
                          onChange={(e) => handleEditChange(p.id, field, e.target.value)}
                          className="w-full border border-[#91EAAF] p-1 rounded"
                        />
                      </td>
                    ))}
                    <td className="p-2">
                      <select
                        value={p.status}
                        onChange={(e) => handleEditChange(p.id, "status", e.target.value)}
                        className="w-full border border-[#91EAAF] p-1 rounded"
                      >
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                      </select>
                    </td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => handleEditSave(p)} className="text-green-600 font-medium">Save</button>
                      <button onClick={() => setEditId(null)} className="text-red-600 font-medium">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">{p.quantity}</td>
                    <td className="p-2">₹{p.price_per_unit}</td>
                    <td className="p-2">{p.category}</td>
                    <td className="p-2 capitalize">{p.status.replace("_", " ")}</td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => handleEdit(p.id)} className="text-blue-600 font-medium">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 font-medium">Delete</button>
                    </td>
                  </>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default SupplierProducts;
