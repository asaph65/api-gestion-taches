// src/middlewares/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware pour vérifier le token JWT
 */
const auth = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Accès non autorisé. Token manquant.",
      });
    }

    const token = authHeader.split(" ")[1];

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Trouver l'utilisateur
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Utilisateur non trouvé.",
      });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    // Différents types d'erreurs JWT
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Token invalide.",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expiré.",
      });
    }

    console.error("Erreur d'authentification:", error);
    res.status(500).json({
      success: false,
      error: "Erreur d'authentification.",
    });
  }
};

/**
 * Middleware pour vérifier les rôles (admin, etc.)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Utilisateur non authentifié.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Rôle ${req.user.role} non autorisé pour cette action.`,
      });
    }

    next();
  };
};

module.exports = { auth, authorize };
