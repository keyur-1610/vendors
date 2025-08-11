import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Invoice = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const passedOrder = state?.order;

    if (passedOrder) {
      sessionStorage.setItem("invoiceOrder", JSON.stringify(passedOrder));
      setOrder(passedOrder);
    } else {
      const stored = sessionStorage.getItem("invoiceOrder");
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    }
  }, [state]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        ❌ No invoice data found.
      </div>
    );
  }

  const {
    id,
    material_name,
    supplier_name,
    vendor_name,
    vendor_email,
    quantity,
    price_per_unit,
    total_price,
    contact,
    address,
    city,
    state: region,
    pincode,
    notes,
    created_at,
  } = order;

  const today = new Date(created_at || Date.now()).toLocaleString();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 print:p-0 print:bg-white">
      <motion.div
        className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8 border print:shadow-none print:border-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-green-700 mb-2">
          Street Connect
        </h1>
        <p className="text-center text-sm text-gray-700 mb-6">
          📞 9876543210 | ✉️ support@streetconnect.com
        </p>

        {/* Vendor Info & Order ID */}
        <div className="flex justify-between mb-2 text-sm">
          <p>
            <strong>Vendor:</strong> {vendor_name}
          </p>
          <p>
            <strong>Order ID:</strong> #{id}
          </p>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          <strong>Date:</strong> {today}
        </div>

        <hr className="my-4" />

        {/* Address */}
        <div className="mb-4 text-sm">
          <h3 className="font-semibold text-gray-800 mb-1">Shipping Address</h3>
          <p>
            {address}, {city}, {region} - {pincode}
          </p>
          <p>📞 {contact}</p>
        </div>

        <hr className="my-4" />

        {/* Supplier Info */}
        <div className="mb-4 text-sm">
          <h3 className="font-semibold text-gray-800 mb-1">Supplier</h3>
          <p>{supplier_name}</p>
        </div>

        <hr className="my-4" />

        {/* Product Table */}
        <div className="mb-6">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 border">Item</th>
                <th className="text-right p-2 border">Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border">
                  {material_name} × {quantity}
                </td>
                <td className="p-2 border text-right">₹{total_price}</td>
              </tr>
            </tbody>
          </table>

          {/* Total */}
          <div className="text-right mt-4 text-lg font-semibold">
            Total: ₹{total_price}
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="text-sm mt-6">
            <h4 className="font-medium text-gray-700 mb-1">📝 Notes:</h4>
            <p className="italic text-gray-600">{notes}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="text-right mt-8 print:hidden">
          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mr-4"
          >
            🖨️ Print Invoice
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("invoiceOrder");
              navigate("/dashboard");
            }}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            ⬅️ Go to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Invoice;
