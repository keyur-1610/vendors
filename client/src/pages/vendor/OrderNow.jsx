import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";

const OrderNow = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const product = state?.product;

  const [form, setForm] = useState({
    vendor_name: "",
    vendor_email: "",
    contact: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    quantity: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        vendor_name: user.name,
        vendor_email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const generatePDF = (data) => {
    const content = `
      <div style="font-family: Arial; padding: 20px;">
        <h1 style="color: #4D7111; text-align: center;">Street Connect</h1>
        <p style="text-align: center; margin-bottom: 20px;">📞 9876543210 | ✉️ support@streetconnect.com</p>
        <div style="display: flex; justify-content: space-between; font-size: 14px;">
          <div><strong>Vendor:</strong> ${data.vendor_name}</div>
          <div><strong>Order ID:</strong> #${data.order_id || "N/A"}</div>
        </div>
        <div style="font-size: 14px; margin-top: 4px;"><strong>Date:</strong> ${
          data.created_at
        }</div>
        <hr style="margin: 16px 0;" />
        <h3 style="margin: 0;">Shipping Address</h3>
        <p style="font-size: 14px;">
          ${data.address}, ${data.city}, ${data.state} - ${data.pincode}<br/>
          📞 ${data.contact}
        </p>
        <hr style="margin: 16px 0;" />
        <h3 style="margin: 0;">Supplier</h3>
        <p style="font-size: 14px;">${data.supplier_name}</p>
        <hr style="margin: 16px 0;" />
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Item</th>
              <th style="border: 1px solid #ccc; padding: 8px; text-align: right;">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid #ccc; padding: 8px;">${
                data.name
              } × ${data.quantity}</td>
              <td style="border: 1px solid #ccc; padding: 8px; text-align: right;">₹${
                data.total_price
              }</td>
            </tr>
          </tbody>
        </table>
        <p style="text-align: right; font-weight: bold; margin-top: 12px;">Total: ₹${
          data.total_price
        }</p>
        ${
          data.notes
            ? `<div style="margin-top: 16px;"><strong>📝 Notes:</strong><br/><em>${data.notes}</em></div>`
            : ""
        }
      </div>
    `;

    html2pdf()
      .from(content)
      .set({
        margin: 10,
        filename: `Invoice_${data.name}_${Date.now()}.pdf`,
        html2canvas: { scale: 2 },
      })
      .save();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product || !form.quantity) {
      return alert("Product or quantity missing.");
    }

    try {
      const res = await api.post("/vendor/orders", {
        material_id: product.id,
        supplier_id: product.supplier_id,
        quantity: Number(form.quantity),
        contact: form.contact,
        address: form.address,
        pincode: form.pincode,
        city: form.city,
        state: form.state,
        notes: form.notes,
      });

      const invoiceData = {
        ...form,
        ...product,
        name: product.name,
        supplier_name: product.supplier_name,
        total_price: product.price_per_unit * form.quantity,
        created_at: new Date().toLocaleString(),
        order_id: res.data.order?.id || "N/A",
      };

      alert("✅ Order placed successfully! Downloading invoice...");
      setTimeout(() => generatePDF(invoiceData), 500);
      navigate("/vendor");
    } catch (err) {
      console.error("❌ Order error:", err);
      alert("❌ Failed to place order.");
    }
  };

  if (!product) {
    return (
      <p className="text-center mt-10 text-red-600">No product data found.</p>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4FFFC] p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white rounded-xl shadow-xl p-6"
      >
        <h2 className="text-3xl font-bold text-[#4D7111] mb-6 text-center">
          🛒 Place Your Order
        </h2>

        {/* Product Info */}
        <div className="bg-[#91EAAF] text-[#1F4B2C] rounded-lg p-4 mb-6 shadow-inner">
          <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
          <p>💰 Price: ₹{product.price_per_unit} / unit</p>
          <p>📦 Available: {product.quantity} units</p>
          <p>
            🏭 Supplier: <strong>{product.supplier_name}</strong>
          </p>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="vendor_name"
              value={form.vendor_name}
              readOnly
              className="p-2 border border-[#91EAAF] bg-[#F4FFFC] rounded"
            />
            <input
              type="email"
              name="vendor_email"
              value={form.vendor_email}
              readOnly
              className="p-2 border border-[#91EAAF] bg-[#F4FFFC] rounded"
            />
            <input
              type="text"
              name="contact"
              value={form.contact}
              onChange={handleChange}
              placeholder="📞 Contact Number"
              className="p-2 border border-[#91EAAF] rounded"
              required
            />
            <input
              type="text"
              name="pincode"
              value={form.pincode}
              onChange={handleChange}
              placeholder="📍 Pincode"
              className="p-2 border border-[#91EAAF] rounded"
              required
            />
          </div>

          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="🏠 Full Address"
            className="w-full p-2 border border-[#91EAAF] rounded"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="🏙️ City"
              className="p-2 border border-[#91EAAF] rounded"
              required
            />
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="🗺️ State"
              className="p-2 border border-[#91EAAF] rounded"
              required
            />
          </div>

          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            className="w-full p-2 border border-[#91EAAF] rounded"
            required
            min={1}
            max={product.quantity}
          />

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="📝 Optional notes (e.g., delivery instructions)"
            className="w-full p-2 border border-[#91EAAF] rounded"
            rows={3}
          />

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-[#4D7111] text-white py-3 rounded hover:bg-[#3b5d0f] transition"
          >
            ✅ Confirm Order & Generate Invoice
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default OrderNow;
