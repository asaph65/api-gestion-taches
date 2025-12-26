// Mettre à jour server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/database");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
connectDB();

// Créer l'application Express
const app = express();

// Middleware de base
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware (optionnel mais utile)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Route de base pour vérifier que l'API fonctionne
app.get("/", (req, res) => {
  res.json({
    message: "API de gestion de tâches",
    version: "1.0.0",
    status: "en ligne",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        profile: "GET /api/auth/me",
      },
      tasks: {
        getAll: "GET /api/tasks",
        create: "POST /api/tasks",
        getOne: "GET /api/tasks/:id",
        update: "PUT /api/tasks/:id",
        delete: "DELETE /api/tasks/:id",
        stats: "GET /api/tasks/stats",
      },
    },
  });
});

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Route 404 pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route non trouvée",
    path: req.originalUrl,
  });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Erreur interne du serveur";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Définir le port
const PORT = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || "development"}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Authentification: /api/auth`);
  console.log(`Tâches: /api/tasks`);
});
