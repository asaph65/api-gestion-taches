# Guide rapide : Configuration MongoDB pour l'application

## 🚀 Démarrage rapide

### Étape 1 : Vérifier la connexion MongoDB Compass

1. Ouvrez MongoDB Compass
2. Vérifiez que vous êtes connecté à `localhost:27017`
3. Vous devriez voir les bases de données par défaut : `admin`, `config`, `local`, `test`

### Étape 2 : Créer/Sélectionner la base de données

Dans MongoDB Compass :

1. Cliquez sur le bouton **"CREATE DATABASE"** en haut à gauche
2. Nom de la base de données : `taskmanager` (ou le nom que vous préférez)
3. Nom de la collection : `users` (laissez vide, sera créée automatiquement)
4. Cliquez sur **"CREATE DATABASE"**

**OU** utilisez simplement l'URI de connexion dans votre fichier `.env` :

```
MONGODB_URI=mongodb://localhost:27017/taskmanager
```

### Étape 3 : Exécuter les commandes MongoDB

#### Option A : Via MongoDB Compass Shell (Recommandé)

1. Dans MongoDB Compass, cliquez sur l'onglet **"MONGOSH"** en bas de l'écran
2. Copiez-collez le contenu du fichier `mongodb-commands.js`
3. Appuyez sur **Entrée** pour exécuter

#### Option B : Via le terminal

```bash
# Depuis le dossier back-end
mongosh < mongodb-commands.js
```

### Étape 4 : Vérifier la configuration

Dans MongoDB Compass, vous devriez maintenant voir :

- ✅ La base de données `taskmanager` (ou votre nom)
- ✅ Les collections `users` et `tasks` (créées automatiquement au premier usage)
- ✅ Les index créés (visible dans l'onglet "Indexes" de chaque collection)

## 📋 Commandes essentielles

### Voir toutes les collections

```javascript
show collections
```

### Voir tous les utilisateurs

```javascript
db.users.find().pretty();
```

### Voir toutes les tâches

```javascript
db.tasks.find().pretty();
```

### Compter les documents

```javascript
db.users.countDocuments();
db.tasks.countDocuments();
```

### Voir les index

```javascript
db.users.getIndexes();
db.tasks.getIndexes();
```

## 🔧 Configuration de l'application

Assurez-vous que votre fichier `.env` dans le dossier `back-end` contient :

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/taskmanager

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise
JWT_EXPIRE=7d

# Port
PORT=5175

# Environnement
NODE_ENV=development
```

## ✅ Test de fonctionnement

1. **Démarrez le serveur backend** :

   ```bash
   cd back-end
   npm start
   ```

2. **Testez l'inscription** via le frontend ou avec curl :

   ```bash
   curl -X POST http://localhost:5175/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "John",
       "lastName": "Doe",
       "email": "john@example.com",
       "password": "password123"
     }'
   ```

3. **Vérifiez dans MongoDB Compass** :
   - Ouvrez la collection `users`
   - Vous devriez voir votre nouvel utilisateur
   - Le mot de passe doit être hashé (commence par `$2a$10$...`)

## 🎯 Structure des données

### Collection `users`

- `_id` : ObjectId unique
- `email` : String (unique, indexé)
- `password` : String (hashé avec bcrypt)
- `firstName` : String
- `lastName` : String
- `role` : String ("user" ou "admin")
- `createdAt` : Date
- `updatedAt` : Date

### Collection `tasks`

- `_id` : ObjectId unique
- `title` : String (requis)
- `description` : String (optionnel)
- `status` : String ("todo", "in_progress", "done", "archived")
- `priority` : String ("low", "medium", "high")
- `dueDate` : Date (optionnel)
- `completedAt` : Date (optionnel)
- `user` : ObjectId (référence vers users.\_id)
- `tags` : Array de Strings
- `isImportant` : Boolean
- `estimatedDuration` : Number (en minutes)
- `actualDuration` : Number (en minutes)
- `createdAt` : Date
- `updatedAt` : Date

## 🐛 Dépannage

### Problème : "MongoDB URI non définie"

- Vérifiez que le fichier `.env` existe dans `back-end/`
- Vérifiez que `MONGODB_URI` est bien défini

### Problème : "Email déjà utilisé"

- C'est normal, l'index unique fonctionne
- Supprimez l'utilisateur existant ou utilisez un autre email

### Problème : Les collections n'apparaissent pas

- C'est normal, elles sont créées automatiquement au premier insert
- Testez l'inscription d'un utilisateur pour créer la collection `users`

## 📚 Ressources

- [Documentation MongoDB](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Compass Guide](https://docs.mongodb.com/compass/)
