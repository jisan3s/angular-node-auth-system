const express = require("express");
const router = express.Router();
const { registerUser, loginUser, forgotPassword, verifyResetCode, resetPassword, getUsers, deleteUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-code", verifyResetCode);
router.post("/reset-password", resetPassword);
router.get("/", protect, getUsers);
router.delete("/:id", protect, deleteUser);

module.exports = router;