// src/config/database.js
const mongoose = require("mongoose");

/**
 * Connexion à MongoDB
 */
const connectDB = async () => {
  try {
    // Utiliser l'URI de développement ou de production
    const mongoURI =
      process.env.NODE_ENV === "production"
        ? process.env.MONGODB_URI_PROD
        : process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error(
        "MongoDB URI non définie dans les variables d'environnement"
      );
    }

    // CORRECTION : Ajouter 'await' et stocker la connexion
    const conn = await mongoose.connect(mongoURI); // <- ICI

    console.log(`MongoDB connecté: ${conn.connection.host}`);
    console.log(`Base de données: ${conn.connection.name}`);

    // Gestion des événements de connexion
    mongoose.connection.on("error", (err) => {
      console.error(`Erreur de connexion MongoDB: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB déconnecté");
    });

    // Gérer la déconnexion proprement
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("Connexion MongoDB fermée (SIGINT)");
      process.exit(0);
    });
  } catch (error) {
    console.error(`Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
