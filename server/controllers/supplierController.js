const db = require("../models/db");

exports.getMyMaterials = (req, res) => {
  const supplierId = req.user.id;
  db.query(
    "SELECT * FROM materials WHERE supplier_id = ?",
    [supplierId],
    (err, results) => {
      if (err) return res.status(500).json({ error: "DB error" });
      res.json(results);
    }
  );
};

// File: /server/controllers/supplierController.js
exports.addMaterial = (req, res) => {
  const supplierId = req.user.id;
  const { name, quantity, price_per_unit, category, status } = req.body;

  if (!name || !quantity || !price_per_unit || !category || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const query = `
    INSERT INTO materials 
    (name, quantity, price_per_unit, category, status, supplier_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [name, quantity, price_per_unit, category, status, supplierId],
    (err, result) => {
      if (err) {
        console.error("MySQL Insert Error:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      res.status(201).json({ message: "Material added successfully" });
    }
  );
};


exports.deleteMaterial = (req, res) => {
  const supplierId = req.user.id;
  const materialId = req.params.id;

  db.query(
    "DELETE FROM materials WHERE id = ? AND supplier_id = ?",
    [materialId, supplierId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Delete failed" });
      if (result.affectedRows === 0)
        return res.status(403).json({ message: "Unauthorized or not found" });
      res.json({ message: "Material deleted" });
    }
  );
};

exports.updateMaterial = (req, res) => {
  const { id } = req.params;
  const { name, quantity, price_per_unit, category, status } = req.body;
  const supplierId = req.user.id; // from auth middleware

  const sql = `
    UPDATE materials 
    SET name = ?, quantity = ?, price_per_unit = ?, category = ?, status = ?
    WHERE id = ? AND supplier_id = ?
  `;

  db.query(
    sql,
    [name, quantity, price_per_unit, category, status, id, supplierId],
    (err, result) => {
      if (err) {
        console.error("❌ Error updating material:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json({ message: "✅ Material updated successfully" });
    }
  );
};

exports.getOrders = (req, res) => {
  const supplierId = req.user.id;

  const query = `
    SELECT o.*, m.name AS material_name, u.name AS vendor_name, u.email AS vendor_email
    FROM orders o
    JOIN materials m ON o.material_id = m.id
    JOIN users u ON o.vendor_id = u.id
    WHERE o.supplier_id = ?
    ORDER BY o.created_at DESC
  `;

  db.query(query, [supplierId], (err, results) => {
    if (err) {
      console.error("❌ Failed to fetch supplier orders:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

exports.updateOrderStatus = (req, res) => {
  const supplierId = req.user.id;
  const orderId = req.params.id;
  const { status } = req.body;

  const query = `
    UPDATE orders
    SET status = ?
    WHERE id = ? AND supplier_id = ?
  `;

  db.query(query, [status, orderId, supplierId], (err, result) => {
    if (err) {
      console.error("❌ Failed to update status:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Order not found or unauthorized" });
    }

    res.json({ message: "✅ Order status updated" });
  });
};

