// src/controllers/authController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * @desc    Inscription d'un nouvel utilisateur
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Un utilisateur avec cet email existe déjà.",
      });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
    });

    // Générer le token JWT
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur d'inscription:", error);

    // Gestion des erreurs de validation Mongoose
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        errors,
      });
    }

    res.status(500).json({
      success: false,
      error: "Erreur lors de l'inscription.",
    });
  }
};

/**
 * @desc    Connexion d'un utilisateur
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'email existe
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Identifiants invalides.",
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Identifiants invalides.",
      });
    }

    // Générer le token JWT
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur de connexion:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la connexion.",
    });
  }
};

/**
 * @desc    Récupérer le profil de l'utilisateur connecté
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    // L'utilisateur est déjà attaché à req.user par le middleware auth
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error("Erreur récupération profil:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la récupération du profil.",
    });
  }
};

/**
 * @desc    Mettre à jour le profil utilisateur
 * @route   PUT /api/auth/me
 * @access  Private
 */
const updateMe = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    // Ne pas permettre de modifier l'email ou le mot de passe via cette route
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profil mis à jour avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur mise à jour profil:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de la mise à jour du profil.",
    });
  }
};

/**
 * @desc    Changer le mot de passe
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Récupérer l'utilisateur avec le mot de passe
    const user = await User.findById(req.userId).select("+password");

    // Vérifier l'ancien mot de passe
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Mot de passe actuel incorrect.",
      });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Mot de passe changé avec succès",
    });
  } catch (error) {
    console.error("Erreur changement mot de passe:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      error: "Erreur lors du changement de mot de passe.",
    });
  }
};

/**
 * Générer un token JWT
 * @param {String} userId - ID de l'utilisateur
 * @returns {String} Token JWT
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
};
