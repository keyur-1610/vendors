const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");

router.get("/stats", authMiddleware, adminController.getStats);
router.get("/users", authMiddleware, adminController.getAllUsers);
router.put("/users/:id", authMiddleware, adminController.updateUser);
router.delete("/users/:id", authMiddleware, adminController.deleteUser);

router.get("/products", authMiddleware, adminController.getAllProducts);
router.delete("/products/:id", authMiddleware, adminController.deleteProduct);

router.get("/orders", authMiddleware, adminController.getAllOrders);
router.put("/orders/:id/status", authMiddleware, adminController.updateOrderStatus);

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Failed to delete user." });
  }
});

router.delete("/admin/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM materials WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete product." });
  }
});
module.exports = router;
