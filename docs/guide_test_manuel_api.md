# Guide de Test Manuel de l'API FormaJOY

Ce guide vous aidera à tester manuellement l'API FormaJOY en utilisant Postman ou un navigateur web.

## Prérequis

1. Assurez-vous que le serveur backend est en cours d'exécution:
   - Ouvrez un terminal dans le dossier `server`
   - Exécutez `npm install` (si ce n'est pas déjà fait)
   - Exécutez `npm start` ou `node server.js`
   - Le serveur devrait démarrer sur `http://localhost:5000`

2. Outils recommandés:
   - [Postman](https://www.postman.com/downloads/) pour tester facilement les requêtes API
   - Ou un navigateur avec une extension comme [JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa) pour les requêtes GET

## Test Rapide Sans Postman

Si vous souhaitez tester rapidement sans installer Postman:

1. Ouvrez votre navigateur et accédez à `http://localhost:5000`
   - Vous devriez voir un message de bienvenue: `{"message":"Bienvenue sur l'API FormaJOY"}`

2. Pour tester un endpoint GET public, essayez `http://localhost:5000/api/courses`
   - Vous devriez voir la liste des cours (vide si aucun cours n'a été créé)

## Test Complet avec Postman

### 1. Configuration de Postman

- Importez la collection Postman fournie dans `docs/postman_collection.json`
- Configurez les variables d'environnement comme indiqué dans le guide `guide_test_api.md`

### 2. Séquence de Test Recommandée

#### Étape 1: Authentification

1. **Inscription d'un administrateur**:
   - Utilisez la requête "Inscription" dans la collection
   - Corps de la requête:
   ```json
   {
     "name": "Admin Test",
     "email": "admin@test.com",
     "password": "password123",
     "role": "admin"
   }
   ```
   - Vérifiez que vous recevez un token JWT dans la réponse

2. **Connexion**:
   - Utilisez la requête "Connexion" dans la collection
   - Corps de la requête:
   ```json
   {
     "email": "admin@test.com",
     "password": "password123"
   }
   ```
   - Le token JWT sera automatiquement sauvegardé dans les variables d'environnement

3. **Vérification du profil**:
   - Utilisez la requête "Profil Utilisateur" pour vérifier que l'authentification fonctionne

#### Étape 2: Gestion des Enseignants

1. **Création d'un enseignant**:
   - Utilisez la requête "Créer un Enseignant"
   - Corps de la requête:
   ```json
   {
     "name": "Enseignant Test",
     "email": "enseignant@test.com",
     "password": "password123",
     "speciality": "Informatique",
     "phone": "0612345678"
   }
   ```
   - Notez l'ID de l'enseignant créé

2. **Liste des enseignants**:
   - Utilisez la requête "Liste des Enseignants" pour vérifier que l'enseignant a été créé

#### Étape 3: Gestion des Cours

1. **Création d'un cours**:
   - Utilisez la requête "Créer un Cours"
   - Corps de la requête (remplacez `teacher_id` par l'ID de l'enseignant créé):
   ```json
   {
     "title": "Cours Test",
     "description": "Description du cours test",
     "price": 1500,
     "teacher": "teacher_id"
   }
   ```
   - Notez l'ID du cours créé

2. **Liste des cours**:
   - Utilisez la requête "Liste des Cours" pour vérifier que le cours a été créé

#### Étape 4: Gestion des Étudiants

1. **Création d'un étudiant**:
   - Utilisez la requête "Créer un Étudiant"
   - Corps de la requête:
   ```json
   {
     "name": "Étudiant Test",
     "email": "etudiant@test.com",
     "password": "password123",
     "phone": "0612345678"
   }
   ```
   - Notez l'ID de l'étudiant créé

2. **Inscription à un cours**:
   - Utilisez la requête "Inscrire un Étudiant à un Cours"
   - Remplacez `:id` par l'ID de l'étudiant et `:courseId` par l'ID du cours

#### Étape 5: Gestion des Sessions

1. **Création d'une session**:
   - Utilisez la requête "Créer une Session"
   - Corps de la requête (remplacez `course_id` par l'ID du cours créé):
   ```json
   {
     "title": "Session Test",
     "course": "course_id",
     "date": "2023-06-15T14:00:00.000Z",
     "duration": 120,
     "status": "planifiée"
   }
   ```
   - Notez l'ID de la session créée

2. **Mise à jour du statut d'une session**:
   - Utilisez la requête "Mettre à jour le statut d'une session"
   - Remplacez `:id` par l'ID de la session
   - Corps de la requête:
   ```json
   {
     "status": "en cours"
   }
   ```

#### Étape 6: Gestion des Présences

1. **Marquer la présence**:
   - Utilisez la requête "Marquer la Présence"
   - Corps de la requête (remplacez les IDs):
   ```json
   {
     "session": "session_id",
     "student": "student_id",
     "status": "présent"
   }
   ```

2. **Vérification des présences**:
   - Utilisez la requête "Présences par Session"
   - Remplacez `:sessionId` par l'ID de la session

#### Étape 7: Gestion des Paiements

1. **Création d'un paiement**:
   - Utilisez la requête "Créer un Paiement"
   - Corps de la requête (remplacez les IDs):
   ```json
   {
     "course": "course_id",
     "student": "student_id",
     "amount": 1500,
     "status": "en attente"
   }
   ```
   - Notez l'ID du paiement créé

2. **Mise à jour du statut d'un paiement**:
   - Utilisez la requête "Mettre à jour le statut d'un paiement"
   - Remplacez `:id` par l'ID du paiement
   - Corps de la requête:
   ```json
   {
     "status": "payé"
   }
   ```

## Conseils de Dépannage

### Problèmes courants

1. **Erreur 401 Unauthorized**:
   - Vérifiez que vous avez bien inclus le token JWT dans l'en-tête Authorization
   - Le token peut avoir expiré, reconnectez-vous pour en obtenir un nouveau

2. **Erreur 404 Not Found**:
   - Vérifiez que l'URL est correcte
   - Vérifiez que l'ID de la ressource existe

3. **Erreur 500 Internal Server Error**:
   - Vérifiez les logs du serveur pour plus de détails
   - Assurez-vous que la base de données MongoDB est accessible

### Vérification de la connexion à MongoDB

Si vous rencontrez des problèmes avec la base de données:

1. Vérifiez que les identifiants MongoDB dans le fichier `.env` sont corrects
2. Assurez-vous que votre adresse IP est autorisée dans les paramètres de sécurité de MongoDB Atlas
3. Testez la connexion avec MongoDB Compass ou un outil similaire

## Conclusion

Ce guide vous a montré comment tester manuellement l'API FormaJOY. Pour une intégration avec l'application mobile Flutter, référez-vous à la documentation API complète dans `api_documentation.md`.