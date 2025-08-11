import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { motion } from "framer-motion";
import html2pdf from "html2pdf.js";

const VendorOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/vendor/orders/history");
      setOrders(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch order history:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await api.put(`/vendor/orders/${orderId}/cancel`);
      fetchOrders();
    } catch (err) {
      alert("❌ Failed to cancel order.");
      console.error(err);
    }
  };

  const handleInvoiceDownload = async (orderId) => {
    try {
      const res = await api.get(`/vendor/orders/${orderId}/invoice`);
      const order = res.data.invoice;
      const invoiceDate = new Date(order.created_at).toLocaleString();

      const content = `
        <div style="font-family: Arial; padding: 20px;">
          <h1 style="color: #4D7111; text-align: center; font-size:3rem;">Street Connect</h1><br>
          <p style="text-align: center;">📞 123456789 | ✉️ support@streetconnect.com</p>

          <div style="margin-top: 20px;">
            <p><strong>Vendor:</strong> ${order.vendor_name}</p>
            <p><strong>Order ID:</strong> #${order.id}</p>
            <p><strong>Date:</strong> ${invoiceDate}</p>
          </div>

          <hr style="margin: 16px 0;" />

          <div>
            <h3>Shipping Address</h3>
            <p>
              ${order.address}, ${order.city}, ${order.state} - ${
        order.pincode
      }<br/>
              📞 ${order.contact}
            </p>
          </div>

          <hr style="margin: 16px 0;" />

          <div>
            <h3>Supplier</h3>
            <p>${order.supplier_name}</p>
          </div>

          <hr style="margin: 16px 0;" />

          <div style="border: 1px solid #ccc; padding: 10px; margin-top: 16px;">
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              <thead style="background: #f4f4f4;">
                <tr>
                  <th style="padding: 8px; text-align: left; border: 1px solid #ccc;">Item</th>
                  <th style="padding: 8px; text-align: right; border: 1px solid #ccc;">Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 8px; border: 1px solid #ccc;">
                    ${order.material_name} × ${order.quantity}
                  </td>
                  <td style="padding: 8px; text-align: right; border: 1px solid #ccc;">
                    ₹${order.total_price}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="margin-top: 12px; text-align: right; font-weight: bold; font-size: 16px;">
            Total: ₹${order.total_price}
          </div>

          ${
            order.notes
              ? `<div style="margin-top: 16px;"><strong>📝 Notes:</strong><br/><em>${order.notes}</em></div>`
              : ""
          }
        </div>
      `;

      html2pdf()
        .from(content)
        .set({
          margin: 10,
          filename: `Invoice_Order_${orderId}.pdf`,
          html2canvas: { scale: 2 },
        })
        .save();
    } catch (err) {
      console.error("❌ Failed to generate invoice:", err);
      alert("Failed to generate invoice.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4FFFC]">
        <p className="text-lg text-[#4D7111] font-semibold">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4FFFC] py-8 px-6">
      <motion.h2
        className="text-4xl font-extrabold text-[#4D7111] mb-8 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        📜 Order History
      </motion.h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No orders placed yet.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-[#91EAAF]">
          <table className="min-w-full text-sm">
            <thead className="bg-[#91EAAF] text-[#1F4B2C]">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Supplier</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-[#F4FFFC]">
                  <td className="p-3">#{order.id}</td>
                  <td className="p-3">{order.material_name}</td>
                  <td className="p-3">{order.supplier_name}</td>
                  <td className="p-3">{order.quantity}</td>
                  <td className="p-3">₹{order.total_price}</td>
                  <td className="p-3 capitalize font-semibold text-[#1F4B2C]">
                    {order.status}
                  </td>
                  <td className="p-3 space-x-2">
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="text-red-600 hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      onClick={() => handleInvoiceDownload(order.id)}
                      className="text-blue-600 hover:underline"
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorOrderHistory;
