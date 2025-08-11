// File: /client/src/components/OrderTable.jsx
import React from "react";

const OrderTable = ({ orders }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Material</th>
            <th className="py-2 px-4 border">Quantity</th>
            <th className="py-2 px-4 border">Price</th>
            <th className="py-2 px-4 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="text-center">
              <td className="py-2 px-4 border">{order.material_name}</td>
              <td className="py-2 px-4 border">{order.quantity}</td>
              <td className="py-2 px-4 border">₹{order.total_price}</td>
              <td className="py-2 px-4 border">{new Date(order.order_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
