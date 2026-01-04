// Script MongoDB pour créer les collections et index
// À exécuter dans MongoDB Compass (onglet MONGOSH) ou dans un shell MongoDB

// ============================================
// 1. SÉLECTIONNER LA BASE DE DONNÉES
// ============================================
// Remplacez 'taskmanager' par le nom de votre base de données
use taskmanager

// ============================================
// 2. CRÉER LES INDEX POUR LA COLLECTION USERS
// ============================================
// Index unique sur l'email (empêche les doublons)
db.users.createIndex(
  { email: 1 },
  { 
    unique: true,
    name: "email_unique_index"
  }
)

// Index sur createdAt pour les requêtes de tri
db.users.createIndex({ createdAt: -1 })

// Vérifier les index créés
print("=== Index de la collection users ===")
db.users.getIndexes()

// ============================================
// 3. CRÉER LES INDEX POUR LA COLLECTION TASKS
// ============================================
// Index composé pour les requêtes par utilisateur et statut
db.tasks.createIndex(
  { user: 1, status: 1 },
  { name: "user_status_index" }
)

// Index composé pour les requêtes par utilisateur et date d'échéance
db.tasks.createIndex(
  { user: 1, dueDate: 1 },
  { name: "user_dueDate_index" }
)

// Index composé pour les requêtes par utilisateur et importance
db.tasks.createIndex(
  { user: 1, isImportant: 1 },
  { name: "user_isImportant_index" }
)

// Index sur les tags pour la recherche
db.tasks.createIndex(
  { tags: 1 },
  { name: "tags_index" }
)

// Index sur createdAt pour le tri chronologique
db.tasks.createIndex({ createdAt: -1 })

// Index sur le champ user pour les jointures
db.tasks.createIndex({ user: 1 })

// Vérifier les index créés
print("\n=== Index de la collection tasks ===")
db.tasks.getIndexes()

// ============================================
// 4. VÉRIFICATION
// ============================================
print("\n=== Collections disponibles ===")
show collections

print("\n=== Statistiques ===")
print("Nombre d'utilisateurs: " + db.users.countDocuments())
print("Nombre de tâches: " + db.tasks.countDocuments())

print("\n✅ Configuration terminée !")
print("Les collections seront créées automatiquement lors de la première insertion.")

