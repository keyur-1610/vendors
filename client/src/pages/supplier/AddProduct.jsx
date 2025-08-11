import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    price_per_unit: "",
    category: "",
    status: "in_stock",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const suggestedCategories = ["Fruits", "Vegetables", "Dairy", "Bakery", "Grains"];

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCategoryClick = (cat) => {
    setForm({ ...form, category: cat });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // For demonstration — adapt to your API's image handling
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (image) formData.append("image", image);

    try {
      await api.post("/supplier/materials", formData);
      alert("✅ Product added!");
      navigate("/supplier/products");
    } catch (error) {
      console.error("Add product error:", error);
      alert("❌ Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FFFC] py-10 px-4 flex items-start justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg border border-[#91EAAF] rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-[#4D7111] mb-6">
          ➕ Add New Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-[#4D7111] mb-2">
              Product Image
            </label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md mb-3 border border-[#91EAAF]"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-600
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-[#91EAAF] file:text-white
                         hover:file:bg-[#1F4B2C]"
            />
          </div>

          {/* Input Fields */}
          {["name", "quantity", "price_per_unit"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-[#4D7111] mb-1">
                {field.replace("_", " ").toUpperCase()}
              </label>
              <input
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#91EAAF] rounded-md bg-[#F4FFFC] focus:outline-none focus:ring-2 focus:ring-[#91EAAF]"
                placeholder={`Enter ${field.replace("_", " ")}`}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {form[field].length} characters
              </p>
            </div>
          ))}

          {/* Category with Suggestions */}
          <div>
            <label className="block text-sm font-semibold text-[#4D7111] mb-1">
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#91EAAF] rounded-md bg-[#F4FFFC] focus:outline-none focus:ring-2 focus:ring-[#91EAAF]"
              placeholder="Type or click below"
              required
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {suggestedCategories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="bg-[#C3E956] text-[#1F4B2C] px-3 py-1 rounded-full text-sm hover:bg-[#1F4B2C] hover:text-white transition"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-[#4D7111] mb-1">
              Stock Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#91EAAF] rounded-md bg-[#F4FFFC] focus:outline-none focus:ring-2 focus:ring-[#91EAAF]"
              required
            >
              <option value="in_stock">In Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full bg-[#C3E956] hover:bg-[#1F4B2C] text-[#1F4B2C] hover:text-white font-semibold px-6 py-3 rounded-md transition duration-300 shadow-md"
            >
              ✅ Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
