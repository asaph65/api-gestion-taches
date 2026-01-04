# Guide : Pousser le code vers GitHub

## Étape 1 : Créer un Personal Access Token (PAT)

1. **Allez sur GitHub** : https://github.com/settings/tokens
2. **Cliquez sur** : "Generate new token" → "Generate new token (classic)"
3. **Configurez le token** :
   - **Note** : `api-gestion-taches-token` (ou un nom de votre choix)
   - **Expiration** : Choisissez une durée (90 jours recommandé)
   - **Scopes** : Cochez uniquement `repo` (accès complet aux dépôts)
4. **Cliquez sur** : "Generate token" (en bas de la page)
5. **COPIEZ LE TOKEN** : Il commence par `ghp_...` 
   ⚠️ **IMPORTANT** : Copiez-le maintenant, vous ne pourrez plus le voir après !

## Étape 2 : Pousser le code

Une fois le token créé, exécutez dans le terminal :

```bash
git push origin main
```

Quand on vous demande :
- **Username** : `asaph65` (votre nom d'utilisateur GitHub)
- **Password** : Collez le token (pas votre mot de passe GitHub)

## Alternative : Utiliser le token directement dans l'URL

Si vous préférez, vous pouvez aussi utiliser le token directement :

```bash
git push https://ghp_VOTRE_TOKEN@github.com/asaph65/api-gestion-taches.git main
```

(Remplacez `VOTRE_TOKEN` par le token que vous avez copié)

## Vérification

Après le push, vérifiez sur GitHub :
- https://github.com/asaph65/api-gestion-taches

Vous devriez voir tous vos fichiers mis à jour !

