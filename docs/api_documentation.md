# Documentation API FormaJOY

Cette documentation est destinée aux développeurs mobiles travaillant sur l'application Flutter FormaJOY. Elle détaille tous les endpoints API disponibles, leurs paramètres, et les réponses attendues.

## Base URL

```
http://localhost:5000/api
```

## Authentification

La plupart des endpoints nécessitent une authentification. Utilisez le token JWT retourné lors de la connexion dans l'en-tête Authorization de vos requêtes.

```
Authorization: Bearer <votre_token_jwt>
```

### Endpoints d'authentification

#### Inscription

```
POST /auth/register
```

**Corps de la requête:**
```json
{
  "name": "Nom Complet",
  "email": "utilisateur@example.com",
  "password": "motdepasse123",
  "role": "admin" // Peut être: admin, enseignant, etudiant, organisation
}
```

**Réponse:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Nom Complet",
    "email": "utilisateur@example.com",
    "role": "admin"
  }
}
```

#### Connexion

```
POST /auth/login
```

**Corps de la requête:**
```json
{
  "email": "utilisateur@example.com",
  "password": "motdepasse123"
}
```

**Réponse:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Nom Complet",
    "email": "utilisateur@example.com",
    "role": "admin"
  }
}
```

#### Obtenir le profil utilisateur

```
GET /auth/me
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Nom Complet",
    "email": "utilisateur@example.com",
    "role": "admin"
  }
}
```

## Enseignants

### Obtenir tous les enseignants

```
GET /teachers
```

**Accès:** Admin

**Réponse:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Nom Enseignant",
      "email": "enseignant@example.com",
      "speciality": "Informatique",
      "phone": "0612345678"
    },
    {...}
  ]
}
```

### Obtenir un enseignant spécifique

```
GET /teachers/:id
```

**Accès:** Admin, Enseignant (son propre profil)

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Nom Enseignant",
    "email": "enseignant@example.com",
    "speciality": "Informatique",
    "phone": "0612345678"
  }
}
```

### Créer un enseignant

```
POST /teachers
```

**Accès:** Admin

**Corps de la requête:**
```json
{
  "name": "Nom Enseignant",
  "email": "enseignant@example.com",
  "password": "motdepasse123",
  "speciality": "Informatique",
  "phone": "0612345678"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Nom Enseignant",
    "email": "enseignant@example.com",
    "speciality": "Informatique",
    "phone": "0612345678"
  }
}
```

### Mettre à jour un enseignant

```
PUT /teachers/:id
```

**Accès:** Admin

**Corps de la requête:**
```json
{
  "speciality": "Mathématiques",
  "phone": "0687654321"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Nom Enseignant",
    "email": "enseignant@example.com",
    "speciality": "Mathématiques",
    "phone": "0687654321"
  }
}
```

### Supprimer un enseignant

```
DELETE /teachers/:id
```

**Accès:** Admin

**Réponse:**
```json
{
  "success": true,
  "data": {}
}
```

## Étudiants

### Obtenir tous les étudiants

```
GET /students
```

**Accès:** Admin

**Réponse:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Nom Étudiant",
      "email": "etudiant@example.com",
      "phone": "0612345678",
      "courses": ["60d21b4667d0d8992e610c85"]
    },
    {...}
  ]
}
```

### Obtenir un étudiant spécifique

```
GET /students/:id
```

**Accès:** Admin, Étudiant (son propre profil)

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Nom Étudiant",
    "email": "etudiant@example.com",
    "phone": "0612345678",
    "courses": ["60d21b4667d0d8992e610c85"]
  }
}
```

### Créer un étudiant

```
POST /students
```

**Accès:** Admin

**Corps de la requête:**
```json
{
  "name": "Nom Étudiant",
  "email": "etudiant@example.com",
  "password": "motdepasse123",
  "phone": "0612345678"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Nom Étudiant",
    "email": "etudiant@example.com",
    "phone": "0612345678",
    "courses": []
  }
}
```

### Inscrire un étudiant à un cours

```
POST /students/:id/enroll/:courseId
```

**Accès:** Admin, Étudiant (son propre profil)

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Nom Étudiant",
    "email": "etudiant@example.com",
    "phone": "0612345678",
    "courses": ["60d21b4667d0d8992e610c85"]
  }
}
```

## Cours

### Obtenir tous les cours

```
GET /courses
```

**Accès:** Public

**Réponse:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Introduction à la Programmation",
      "description": "Cours d'introduction à la programmation",
      "price": 1500,
      "teacher": "60d21b4667d0d8992e610c85",
      "students": ["60d21b4667d0d8992e610c85"]
    },
    {...}
  ]
}
```

### Obtenir un cours spécifique

```
GET /courses/:id
```

**Accès:** Public

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Introduction à la Programmation",
    "description": "Cours d'introduction à la programmation",
    "price": 1500,
    "teacher": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Nom Enseignant"
    },
    "students": [
      {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Nom Étudiant"
      }
    ]
  }
}
```

### Créer un cours

```
POST /courses
```

**Accès:** Admin

**Corps de la requête:**
```json
{
  "title": "Introduction à la Programmation",
  "description": "Cours d'introduction à la programmation",
  "price": 1500,
  "teacher": "60d21b4667d0d8992e610c85"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Introduction à la Programmation",
    "description": "Cours d'introduction à la programmation",
    "price": 1500,
    "teacher": "60d21b4667d0d8992e610c85",
    "students": []
  }
}
```

## Organisations

### Obtenir toutes les organisations

```
GET /organizations
```

**Accès:** Admin

**Réponse:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Nom Organisation",
      "email": "organisation@example.com",
      "phone": "0612345678",
      "address": "Adresse de l'organisation"
    },
    {...}
  ]
}
```

### Obtenir une organisation spécifique

```
GET /organizations/:id
```

**Accès:** Admin, Organisation (son propre profil)

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Nom Organisation",
    "email": "organisation@example.com",
    "phone": "0612345678",
    "address": "Adresse de l'organisation"
  }
}
```

## Participants

### Obtenir tous les participants

```
GET /participants
```

**Accès:** Admin, Organisation

**Réponse:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Nom Participant",
      "email": "participant@example.com",
      "phone": "0612345678",
      "organization": "60d21b4667d0d8992e610c85",
      "courses": ["60d21b4667d0d8992e610c85"]
    },
    {...}
  ]
}
```

### Inscrire un participant à un cours

```
POST /participants/:id/enroll/:courseId
```

**Accès:** Admin, Organisation

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Nom Participant",
    "email": "participant@example.com",
    "phone": "0612345678",
    "organization": "60d21b4667d0d8992e610c85",
    "courses": ["60d21b4667d0d8992e610c85"]
  }
}
```

## Sessions

### Obtenir toutes les sessions

```
GET /sessions
```

**Accès:** Public

**Réponse:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Session 1",
      "course": "60d21b4667d0d8992e610c85",
      "date": "2023-06-15T14:00:00.000Z",
      "duration": 120,
      "status": "planifiée"
    },
    {...}
  ]
}
```

### Obtenir les sessions d'un cours

```
GET /sessions/course/:courseId
```

**Accès:** Public

**Réponse:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Session 1",
      "course": "60d21b4667d0d8992e610c85",
      "date": "2023-06-15T14:00:00.000Z",
      "duration": 120,
      "status": "planifiée"
    },
    {...}
  ]
}
```

### Mettre à jour le statut d'une session

```
PUT /sessions/:id/status
```

**Accès:** Admin, Enseignant

**Corps de la requête:**
```json
{
  "status": "terminée" // Peut être: planifiée, en cours, terminée, annulée
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Session 1",
    "course": "60d21b4667d0d8992e610c85",
    "date": "2023-06-15T14:00:00.000Z",
    "duration": 120,
    "status": "terminée"
  }
}
```

## Présences

### Obtenir les présences d'une session

```
GET /attendances/session/:sessionId
```

**Accès:** Admin, Enseignant

**Réponse:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "session": "60d21b4667d0d8992e610c85",
      "student": {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "Nom Étudiant"
      },
      "status": "présent",
      "date": "2023-06-15T14:00:00.000Z"
    },
    {...}
  ]
}
```

### Marquer la présence

```
POST /attendances/mark
```

**Accès:** Admin, Enseignant

**Corps de la requête:**
```json
{
  "session": "60d21b4667d0d8992e610c85",
  "student": "60d21b4667d0d8992e610c85",
  "status": "présent" // Peut être: présent, absent, retard
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "session": "60d21b4667d0d8992e610c85",
    "student": "60d21b4667d0d8992e610c85",
    "status": "présent",
    "date": "2023-06-15T14:00:00.000Z"
  }
}
```

## Paiements

### Obtenir tous les paiements

```
GET /payments
```

**Accès:** Admin

**Réponse:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "course": "60d21b4667d0d8992e610c85",
      "student": "60d21b4667d0d8992e610c85",
      "amount": 1500,
      "status": "payé",
      "paymentDate": "2023-06-15T14:00:00.000Z"
    },
    {...}
  ]
}
```

### Obtenir les paiements d'un étudiant

```
GET /payments/student/:studentId
```

**Accès:** Admin, Étudiant (ses propres paiements)

**Réponse:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "course": {
        "_id": "60d21b4667d0d8992e610c85",
        "title": "Introduction à la Programmation"
      },
      "amount": 1500,
      "status": "payé",
      "paymentDate": "2023-06-15T14:00:00.000Z"
    },
    {...}
  ]
}
```

### Mettre à jour le statut d'un paiement

```
PUT /payments/:id/status
```

**Accès:** Admin

**Corps de la requête:**
```json
{
  "status": "payé" // Peut être: en attente, payé, annulé
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "course": "60d21b4667d0d8992e610c85",
    "student": "60d21b4667d0d8992e610c85",
    "amount": 1500,
    "status": "payé",
    "paymentDate": "2023-06-15T14:00:00.000Z"
  }
}
```

## Codes d'erreur

En cas d'erreur, l'API renvoie un code d'état HTTP approprié avec un message d'erreur explicatif.

```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

### Codes d'état courants

- **400** - Bad Request (Requête incorrecte)
- **401** - Unauthorized (Non autorisé, authentification requise)
- **403** - Forbidden (Interdit, droits insuffisants)
- **404** - Not Found (Ressource non trouvée)
- **500** - Internal Server Error (Erreur interne du serveur)

## Conseils pour l'intégration mobile

1. **Gestion du token** - Stockez le token JWT de manière sécurisée (secure storage) et incluez-le dans toutes les requêtes authentifiées.

2. **Gestion des erreurs** - Implémentez une gestion robuste des erreurs pour traiter les différents codes d'état HTTP.

3. **Mise en cache** - Mettez en cache les données qui ne changent pas fréquemment pour améliorer les performances.

4. **État de connexion** - Vérifiez l'état de connexion Internet avant d'effectuer des requêtes API.

5. **Pagination** - Utilisez les paramètres de pagination pour les listes longues (par exemple, `?page=1&limit=10`).

6. **Rafraîchissement** - Implémentez un mécanisme de rafraîchissement (pull-to-refresh) pour mettre à jour les données.

7. **Mode hors ligne** - Envisagez d'implémenter un mode hors ligne pour les fonctionnalités essentielles.