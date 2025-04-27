# Guide de Test de l'API FormaJOY pour Développeurs Mobile

Ce guide explique comment tester l'API FormaJOY et utiliser la documentation pour le développement de l'application mobile.

## Prérequis

- [Postman](https://www.postman.com/downloads/) installé sur votre machine
- Serveur FormaJOY en cours d'exécution (par défaut sur `http://localhost:5000`)

## Configuration de l'environnement de test

### 1. Importer la collection Postman

1. Ouvrez Postman
2. Cliquez sur "Import" en haut à gauche
3. Sélectionnez le fichier `postman_collection.json` situé dans le dossier `docs`
4. La collection "FormaJOY API" apparaîtra dans votre liste de collections

### 2. Configurer les variables d'environnement

1. Cliquez sur l'icône d'engrenage (⚙️) en haut à droite
2. Sélectionnez "Manage Environments"
3. Cliquez sur "Add"
4. Nommez l'environnement "FormaJOY Local"
5. Ajoutez les variables suivantes:
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: laissez vide (sera rempli automatiquement)
   - `teacherId`: laissez vide (sera rempli automatiquement)
   - `studentId`: laissez vide (à remplir manuellement après création)
   - `courseId`: laissez vide (sera rempli automatiquement)
   - `sessionId`: laissez vide (à remplir manuellement après création)
   - `paymentId`: laissez vide (à remplir manuellement après création)
6. Cliquez sur "Save"
7. Sélectionnez l'environnement "FormaJOY Local" dans le menu déroulant en haut à droite

## Procédure de test

Suivez ces étapes pour tester l'API de manière méthodique:

### 1. Authentification

1. Exécutez la requête "Inscription" pour créer un compte administrateur
2. Exécutez la requête "Connexion" pour obtenir un token JWT (sauvegardé automatiquement)
3. Vérifiez que la requête "Profil Utilisateur" fonctionne correctement

### 2. Gestion des enseignants

1. Exécutez la requête "Créer un Enseignant" (l'ID sera sauvegardé automatiquement)
2. Vérifiez que la requête "Liste des Enseignants" renvoie l'enseignant créé
3. Vérifiez que la requête "Détails d'un Enseignant" fonctionne avec l'ID sauvegardé

### 3. Gestion des cours

1. Exécutez la requête "Créer un Cours" (l'ID sera sauvegardé automatiquement)
2. Vérifiez que la requête "Liste des Cours" renvoie le cours créé
3. Vérifiez que la requête "Détails d'un Cours" fonctionne avec l'ID sauvegardé

### 4. Gestion des étudiants et inscriptions

1. Créez un étudiant via l'API (utilisez la requête "Créer un Étudiant" dans la collection)
2. Copiez l'ID de l'étudiant créé et enregistrez-le dans la variable d'environnement `studentId`
3. Testez l'inscription d'un étudiant à un cours avec la requête "Inscrire un Étudiant à un Cours"

### 5. Gestion des sessions

1. Créez une session via l'API (utilisez la requête appropriée)
2. Copiez l'ID de la session créée et enregistrez-le dans la variable d'environnement `sessionId`
3. Testez la mise à jour du statut d'une session

### 6. Gestion des présences

1. Testez la requête "Marquer la Présence" pour un étudiant à une session
2. Vérifiez que la requête "Présences par Session" renvoie la présence créée

### 7. Gestion des paiements

1. Créez un paiement via l'API
2. Copiez l'ID du paiement créé et enregistrez-le dans la variable d'environnement `paymentId`
3. Testez la mise à jour du statut d'un paiement
4. Vérifiez que la requête "Paiements par Étudiant" fonctionne correctement

## Utilisation de la documentation API

La documentation complète de l'API se trouve dans le fichier `api_documentation.md`. Elle contient:

- La description détaillée de tous les endpoints
- Les paramètres requis pour chaque requête
- Les formats de réponse attendus
- Les codes d'erreur possibles
- Des conseils pour l'intégration mobile

Utilisez cette documentation comme référence lors du développement de l'application mobile Flutter.

## Conseils pour le développement mobile

1. **Architecture** - Utilisez une architecture propre (Clean Architecture) ou MVVM pour organiser votre code
2. **Gestion d'état** - Utilisez Provider, Bloc ou Riverpod pour la gestion d'état
3. **Modèles** - Créez des classes de modèle qui correspondent aux réponses JSON de l'API
4. **Service API** - Implémentez une couche de service qui encapsule toutes les requêtes API
5. **Intercepteurs** - Configurez un intercepteur HTTP pour ajouter automatiquement le token JWT aux requêtes
6. **Gestion des erreurs** - Implémentez une gestion robuste des erreurs API
7. **Tests** - Écrivez des tests unitaires pour vos services API

## Problèmes courants et solutions

### Erreur 401 Unauthorized

- Vérifiez que le token JWT est correctement inclus dans l'en-tête Authorization
- Le token peut avoir expiré, reconnectez-vous pour obtenir un nouveau token

### Erreur 403 Forbidden

- L'utilisateur n'a pas les droits suffisants pour accéder à cette ressource
- Vérifiez que le rôle de l'utilisateur est approprié pour l'action demandée

### Erreur 404 Not Found

- Vérifiez que l'ID de la ressource est correct
- Assurez-vous que la ressource existe toujours dans la base de données

### Erreur de connexion

- Vérifiez que le serveur FormaJOY est en cours d'exécution
- Vérifiez que l'URL de base est correcte dans les variables d'environnement

## Support

Pour toute question ou problème concernant l'API, contactez l'équipe de développement backend.