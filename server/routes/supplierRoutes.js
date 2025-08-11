const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const supplierController = require("../controllers/supplierController");

const {
  getMyMaterials,
  addMaterial,
  deleteMaterial,
  updateMaterial,
} = require("../controllers/supplierController");

router.get("/materials/mine", authMiddleware, getMyMaterials);
router.post("/materials", authMiddleware, addMaterial);
router.delete("/materials/:id", authMiddleware, deleteMaterial);
router.put("/materials/:id", authMiddleware, updateMaterial);
router.get("/orders", authMiddleware, supplierController.getOrders);

// ✅ Update delivery status
router.put("/orders/:id/status", authMiddleware, supplierController.updateOrderStatus);
module.exports = router;
