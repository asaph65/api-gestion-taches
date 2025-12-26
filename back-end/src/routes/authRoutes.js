// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
} = require("../controllers/authController");
const { auth } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} = require("../utils/validators");

// Routes publiques
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

// Routes protégées
router.get("/me", auth, getMe);
router.put("/me", auth, validate(updateProfileSchema), updateMe);
router.put(
  "/change-password",
  auth,
  validate(changePasswordSchema),
  changePassword
);

module.exports = router;
