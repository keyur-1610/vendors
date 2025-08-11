// File: /server/controllers/adminController.js
const db = require("../models/db");

exports.getStats = (req, res) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM users WHERE role = 'vendor') AS vendors,
      (SELECT COUNT(*) FROM users WHERE role = 'supplier') AS suppliers,
      (SELECT COUNT(*) FROM orders) AS orders,
      (SELECT COUNT(*) FROM materials) AS materials
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Admin stats fetch error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results[0]);
  });
};
exports.getAllUsers = (req, res) => {
  db.query("SELECT id, name, email, role FROM users", (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(results);
  });
};

exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, email, role } = req.body;
  db.query(
    "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?",
    [name, email, role, userId],
    (err) => {
      if (err) return res.status(500).json({ message: "Update failed" });
      res.json({ message: "User updated" });
    }
  );
};

exports.deleteUser = (req, res) => {
  const userId = req.params.id;
  db.query("DELETE FROM users WHERE id = ?", [userId], (err) => {
    if (err) return res.status(500).json({ message: "Delete failed" });
    res.json({ message: "User deleted" });
  });
};

// Products
exports.getAllProducts = (req, res) => {
  const query = `
    SELECT m.*, u.name AS supplier_name 
    FROM materials m 
    JOIN users u ON m.supplier_id = u.id
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(results);
  });
};

exports.deleteProduct = (req, res) => {
  const productId = req.params.id;
  db.query("DELETE FROM materials WHERE id = ?", [productId], (err) => {
    if (err) return res.status(500).json({ message: "Delete failed" });
    res.json({ message: "Product deleted" });
  });
};

// Orders
exports.getAllOrders = (req, res) => {
  const query = `
    SELECT o.*, u.name AS vendor_name, s.name AS supplier_name, m.name AS material_name
    FROM orders o
    JOIN users u ON o.vendor_id = u.id
    JOIN users s ON o.supplier_id = s.id
    JOIN materials m ON o.material_id = m.id
    ORDER BY o.created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    res.json(results);
  });
};

exports.updateOrderStatus = (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, orderId],
    (err) => {
      if (err) return res.status(500).json({ message: "Update failed" });
      res.json({ message: "Order status updated" });
    }
  );
};
