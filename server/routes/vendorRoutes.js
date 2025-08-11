// /server/routes/vendorRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const vendorController = require("../controllers/vendorController");

// ✅ Route to get all products
router.get("/products", authMiddleware, vendorController.getAllProducts);

// ✅ Route to place an order
router.post("/orders", authMiddleware, vendorController.placeOrder);
router.get("/orders/history", authMiddleware, vendorController.getOrderHistory);
router.put("/orders/:id/cancel", authMiddleware, vendorController.cancelOrder);
router.get("/orders/:id/invoice", authMiddleware, vendorController.getInvoice);
router.get("/suppliers", authMiddleware, vendorController.getSuppliers);
router.get("/supplier/:id/products", authMiddleware, vendorController.getProductsBySupplier);
module.exports = router;
