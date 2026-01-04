# Commandes MongoDB pour la configuration de la base de données

## Connexion à MongoDB Compass

Vous êtes déjà connecté à `localhost:27017`.

## Nom de la base de données

Par défaut, MongoDB utilise le nom de la base de données spécifié dans votre URI de connexion.
Si vous utilisez une URI comme `mongodb://localhost:27017/taskmanager`, la base de données s'appelle `taskmanager`.

## Commandes à exécuter dans MongoDB Compass

### 1. Sélectionner/Créer la base de données

Dans MongoDB Compass, créez ou sélectionnez votre base de données (par exemple : `taskmanager`).

### 2. Créer la collection `users` avec index

Ouvrez le shell MongoDB dans Compass (bouton "MONGOSH" en bas) et exécutez :

```javascript
// Utiliser la base de données
use taskmanager

// Créer la collection users (sera créée automatiquement lors de la première insertion)
// Créer un index unique sur l'email
db.users.createIndex({ email: 1 }, { unique: true })

// Vérifier les index
db.users.getIndexes()
```

### 3. Créer la collection `tasks` avec index

```javascript
// Créer les index pour optimiser les requêtes
db.tasks.createIndex({ user: 1, status: 1 });
db.tasks.createIndex({ user: 1, dueDate: 1 });
db.tasks.createIndex({ user: 1, isImportant: 1 });
db.tasks.createIndex({ tags: 1 });

// Vérifier les index
db.tasks.getIndexes();
```

### 4. Vérifier les collections créées

```javascript
// Lister toutes les collections
show collections

// Vérifier le nombre de documents
db.users.countDocuments()
db.tasks.countDocuments()
```

## Structure des documents

### Collection `users`

```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  password: "$2a$10$...", // Hash bcrypt
  firstName: "John",
  lastName: "Doe",
  role: "user", // ou "admin"
  createdAt: ISODate("2025-01-04T..."),
  updatedAt: ISODate("2025-01-04T...")
}
```

### Collection `tasks`

```javascript
{
  _id: ObjectId("..."),
  title: "Ma tâche",
  description: "Description de la tâche",
  status: "todo", // "todo", "in_progress", "done", "archived"
  priority: "medium", // "low", "medium", "high"
  dueDate: ISODate("2025-01-10T..."), // Optionnel
  completedAt: ISODate("2025-01-04T..."), // Optionnel
  user: ObjectId("..."), // Référence vers users._id
  tags: ["urgent", "important"],
  isImportant: false,
  estimatedDuration: 60, // en minutes, optionnel
  actualDuration: 45, // en minutes, optionnel
  createdAt: ISODate("2025-01-04T..."),
  updatedAt: ISODate("2025-01-04T...")
}
```

## Commandes utiles pour le développement

### Insérer un utilisateur de test (mot de passe: "password123")

```javascript
// Le mot de passe sera automatiquement hashé par Mongoose
// Utilisez plutôt l'API d'inscription pour créer des utilisateurs
```

### Voir tous les utilisateurs

```javascript
db.users.find().pretty();
```

### Voir toutes les tâches

```javascript
db.tasks.find().pretty();
```

### Voir les tâches d'un utilisateur spécifique

```javascript
db.tasks.find({ user: ObjectId("USER_ID_ICI") }).pretty();
```

### Supprimer toutes les données (ATTENTION : développement uniquement)

```javascript
db.users.deleteMany({});
db.tasks.deleteMany({});
```

### Supprimer une collection

```javascript
db.users.drop();
db.tasks.drop();
```

## Notes importantes

1. **Les collections sont créées automatiquement** lors de la première insertion via Mongoose
2. **Les index sont créés automatiquement** par Mongoose selon les schémas définis
3. **Le mot de passe est hashé automatiquement** par le middleware Mongoose avant la sauvegarde
4. **Les timestamps (createdAt, updatedAt)** sont gérés automatiquement par Mongoose

## Vérification de la connexion

Pour vérifier que tout fonctionne :

1. Démarrez votre serveur backend
2. Inscrivez-vous via le frontend
3. Vérifiez dans MongoDB Compass que :
   - La collection `users` contient votre utilisateur
   - Le mot de passe est hashé (ne commence pas par votre mot de passe en clair)
   - Créez une tâche et vérifiez qu'elle apparaît dans la collection `tasks`
