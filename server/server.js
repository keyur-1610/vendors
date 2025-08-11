// File: /server/server.js
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const adminRoutes = require("./routes/adminRoutes");
const db = require("./models/db");


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));