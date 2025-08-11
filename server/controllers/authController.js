// File: /server/controllers/authController.js
const db = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Register a new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role],
      (err, result) => {
        if (err) {
          console.error("❌ MySQL error during registration:", err);
          return res.status(500).json({ message: "Database error", error: err });
        }
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
};

// ✅ Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) {
        console.error("❌ MySQL error during login:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "User not found or invalid credentials" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    });
  } catch (error) {
    console.error("❌ Server error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Get user profile
exports.getProfile = (req, res) => {
  db.query(
    `SELECT id, name, email, role, contact, address, city, state, pincode
     FROM users WHERE id = ?`,
    [req.user.id],
    (err, results) => {
      if (err) {
        console.error("❌ Failed to fetch profile:", err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json({ user: results[0] });
    }
  );
};

// ✅ Update user profile
exports.updateProfile = async (req, res) => {
  const { name, email, password, contact, address, city, state, pincode } = req.body;

  const updates = [];
  const params = [];

  if (name) {
    updates.push("name = ?");
    params.push(name);
  }
  if (email) {
    updates.push("email = ?");
    params.push(email);
  }
  if (contact) {
    updates.push("contact = ?");
    params.push(contact);
  }
  if (address) {
    updates.push("address = ?");
    params.push(address);
  }
  if (city) {
    updates.push("city = ?");
    params.push(city);
  }
  if (state) {
    updates.push("state = ?");
    params.push(state);
  }
  if (pincode) {
    updates.push("pincode = ?");
    params.push(pincode);
  }
  if (password && password.trim() !== "") {
    const hashed = await bcrypt.hash(password, 10);
    updates.push("password = ?");
    params.push(hashed);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: "No fields provided for update" });
  }

  params.push(req.user.id);

  const query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;

  db.query(query, params, (err) => {
    if (err) {
      console.error("❌ Failed to update profile:", err);
      return res.status(500).json({ message: "Update failed" });
    }
    res.json({ message: "✅ Profile updated successfully" });
  });
};
