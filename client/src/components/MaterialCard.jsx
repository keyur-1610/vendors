// File: /client/src/components/MaterialCard.jsx
import React from "react";

const MaterialCard = ({ material, onOrder }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow w-full md:w-80">
      <h3 className="text-lg font-bold mb-2">{material.name}</h3>
      <p>Category: {material.category}</p>
      <p>Quantity: {material.quantity}</p>
      <p>Price: ₹{material.price_per_unit}</p>
      {onOrder && (
        <button
          onClick={() => onOrder(material)}
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Order
        </button>
      )}
    </div>
  );
};

export default MaterialCard;

