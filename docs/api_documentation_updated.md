# Documentation API FormaJOY

Cette documentation détaille tous les endpoints API disponibles pour l'application FormaJOY.

## Base URL

```
http://localhost:5050/api
```

## Authentification

La plupart des endpoints nécessitent une authentification via JWT.

### Headers requis
```
Authorization: Bearer <votre_token_jwt>
```

## Endpoints

### Authentification

#### Inscription Administrateur
```http
POST /api/auth/register-admin
```

**Corps de la requête:**
```json
{
  "nom": "Nom Admin",
  "prenom": "Prénom Admin",
  "email": "admin@example.com",
  "password": "motdepasse123"
}
```

**Réponse:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "nom": "Nom Admin",
    "prenom": "Prénom Admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### Inscription Utilisateur
```http
POST /api/auth/register
```

**Corps de la requête:**
```json
{
  "nom": "Nom Utilisateur",
  "prenom": "Prénom Utilisateur",
  "email": "utilisateur@example.com",
  "password": "motdepasse123",
  "role": "enseignant",
  "additionalData": {}
}
```

**Réponse:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "nom": "Nom Utilisateur",
    "prenom": "Prénom Utilisateur",
    "email": "utilisateur@example.com",
    "role": "enseignant"
  }
}
```

### Cours

#### Obtenir tous les cours
```http
GET /api/courses
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
      "enseignant": {
        "_id": "60d21b4667d0d8992e610c86",
        "nom": "Nom Enseignant",
        "prenom": "Prénom Enseignant"
      }
    }
  ]
}
```

#### Obtenir un cours spécifique
```http
GET /api/courses/:id
```

**Accès:** Public

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "enseignant": {
      "nom": "Nom Enseignant",
      "prenom": "Prénom Enseignant",
      "email": "enseignant@example.com",
      "specialite": "Matière",
      "telephone": "0612345678"
    },
    "etudiantsInscrits": [
      {
        "nom": "Nom Étudiant",
        "prenom": "Prénom Étudiant",
        "email": "etudiant@example.com"
      }
    ]
  }
}
```

#### Créer un nouveau cours
```http
POST /api/courses
```

**Accès:** Admin

**Corps de la requête:**
```json
{
  "titre": "Titre du cours",
  "description": "Description du cours",
  "enseignant": "60d21b4667d0d8992e610c86",
  "prix": 1000
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "titre": "Titre du cours",
    "description": "Description du cours",
    "enseignant": "60d21b4667d0d8992e610c86",
    "prix": 1000
  }
}
```

#### Mettre à jour un cours
```http
PUT /api/courses/:id
```

**Accès:** Admin

**Corps de la requête:**
```json
{
  "titre": "Nouveau titre",
  "prix": 1200
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c85",
    "titre": "Nouveau titre",
    "prix": 1200
  }
}
```