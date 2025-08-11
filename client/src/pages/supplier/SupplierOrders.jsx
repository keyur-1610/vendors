import React, { useEffect, useState } from "react";
import api from "../../api/api";

const SupplierOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/supplier/orders");
            setOrders(res.data || []);
        } catch (err) {
            console.error("❌ Failed to load orders:", err);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/supplier/orders/${id}/status`, { status });
            fetchOrders();
        } catch (err) {
            alert("❌ Failed to update status");
            console.error(err);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">📦 Orders Received</h2>
            {orders.length === 0 ? (
                <p>No orders yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Order ID</th>
                                <th className="p-2 border">Product</th>
                                <th className="p-2 border">Vendor</th>
                                <th className="p-2 border">Qty</th>
                                <th className="p-2 border">Total</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="p-2 border">{order.id}</td>
                                    <td className="p-2 border">{order.material_name}</td>
                                    <td className="p-2 border">{order.vendor_name} ({order.vendor_email})</td>
                                    <td className="p-2 border">{order.quantity}</td>
                                    <td className="p-2 border">₹{order.total_price}</td>
                                    <td className="p-2 border capitalize">{order.status}</td>
                                    <td className="p-2 border">
                                        {order.status === "pending" ? (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, "delivered")}
                                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                            >
                                                Mark Delivered
                                            </button>
                                        ) : order.status === "cancelled" ? (
                                            <span className="text-red-600 font-semibold">Order Cancelled</span>
                                        ) : (
                                            <span className="text-green-700 font-semibold">Delivered</span>
                                        )}


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

export default SupplierOrders;
