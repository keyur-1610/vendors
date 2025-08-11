const db = require("../models/db");

// 🔍 Get all products
exports.getAllProducts = (req, res) => {
  const query = `
    SELECT m.id, m.name, m.quantity, m.price_per_unit, m.category, m.status, m.supplier_id,
           u.name AS supplier_name
    FROM materials m
    JOIN users u ON m.supplier_id = u.id
    WHERE m.quantity > 0
    ORDER BY m.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching products:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

// 🛒 Place an order
exports.placeOrder = async (req, res) => {
  const vendorId = req.user.id;
  const {
    material_id,
    supplier_id,
    quantity,
    contact,
    address,
    pincode,
    city,
    state,
    notes
  } = req.body;

  if (!material_id || !supplier_id || !quantity) {
    return res.status(400).json({ message: "Missing order details" });
  }

  try {
    const [material] = await new Promise((resolve, reject) => {
      db.query(
        "SELECT price_per_unit FROM materials WHERE id = ?",
        [material_id],
        (err, results) => {
          if (err) reject(err);
          else resolve(results);
        }
      );
    });

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    const total_price = Number(material.price_per_unit) * Number(quantity);

    // Insert order
    const insertQuery = `
      INSERT INTO orders 
      (vendor_id, supplier_id, material_id, quantity, contact, address, pincode, city, state, notes, total_price, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;

    db.query(
      insertQuery,
      [
        vendorId,
        supplier_id,
        material_id,
        quantity,
        contact,
        address,
        pincode,
        city,
        state,
        notes,
        total_price,
      ],
      (err, result) => {
        if (err) {
          console.error("❌ Failed to place order:", err);
          return res.status(500).json({ message: "Database error" });
        }

        const orderId = result.insertId;

        // Update stock
        db.query(
          "UPDATE materials SET quantity = quantity - ? WHERE id = ?",
          [quantity, material_id]
        );

        // Fetch order for invoice
        const fetchQuery = `
          SELECT o.*, m.name AS material_name, m.price_per_unit, u.name AS supplier_name 
          FROM orders o
          JOIN materials m ON o.material_id = m.id
          JOIN users u ON o.supplier_id = u.id
          WHERE o.id = ?
        `;

        db.query(fetchQuery, [orderId], (fetchErr, fetchResults) => {
          if (fetchErr || fetchResults.length === 0) {
            console.warn("⚠️ Order placed but failed to fetch for invoice.");
            return res.status(201).json({ message: "✅ Order placed." });
          }

          res.status(201).json({
            message: "✅ Order placed successfully",
            order: fetchResults[0],
          });
        });
      }
    );
  } catch (error) {
    console.error("❌ Order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📜 Order History
exports.getOrderHistory = (req, res) => {
  const vendorId = req.user.id;

  const query = `
    SELECT o.*, m.name AS material_name, m.price_per_unit, u.name AS supplier_name 
    FROM orders o
    JOIN materials m ON o.material_id = m.id
    JOIN users u ON o.supplier_id = u.id
    WHERE o.vendor_id = ?
    ORDER BY o.created_at DESC
  `;

  db.query(query, [vendorId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching order history:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(results);
  });
};

// ❌ Cancel an order
exports.cancelOrder = (req, res) => {
  const vendorId = req.user.id;
  const orderId = req.params.id;

  const cancelQuery = `
    UPDATE orders 
    SET status = 'cancelled' 
    WHERE id = ? AND vendor_id = ? AND status = 'pending'
  `;

  db.query(cancelQuery, [orderId, vendorId], (err, result) => {
    if (err) {
      console.error("❌ Error canceling order:", err);
      return res.status(500).json({ message: "DB error" });
    }
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Order cannot be canceled" });
    }
    res.json({ message: "✅ Order cancelled successfully" });
  });
};

// 🧾 Get Invoice
exports.getInvoice = (req, res) => {
  const vendorId = req.user.id;
  const orderId = req.params.id;

  const query = `
    SELECT o.*, m.name AS material_name, m.price_per_unit, u.name AS supplier_name 
    FROM orders o
    JOIN materials m ON o.material_id = m.id
    JOIN users u ON o.supplier_id = u.id
    WHERE o.id = ? AND o.vendor_id = ?
  `;

  db.query(query, [orderId, vendorId], (err, results) => {
    if (err) {
      console.error("❌ Error generating invoice:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ invoice: results[0] });
  });
};

// 🧑‍🏭 Supplier list for vendor home
exports.getSuppliers = (req, res) => {
  const query = `
    SELECT id, name, email, contact, city, state
    FROM users
    WHERE role = 'supplier'
    ORDER BY created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching suppliers:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};

// 🔍 Get products by supplier
exports.getProductsBySupplier = (req, res) => {
  const supplierId = req.params.id;

  const query = `
    SELECT m.*, u.name AS supplier_name
    FROM materials m
    JOIN users u ON m.supplier_id = u.id
    WHERE m.supplier_id = ? AND m.quantity > 0
    ORDER BY m.created_at DESC
  `;

  db.query(query, [supplierId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching supplier products:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(results);
  });
};
