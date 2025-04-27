# FormaJOY - Système de Gestion pour Centre de Formation

FormaJOY est une application de gestion complète pour les centres de formation, disponible en version web (MERN stack) et mobile. Le système prend en charge à la fois les inscriptions individuelles d'étudiants et les inscriptions d'organisations avec plusieurs participants.

## Fonctionnalités Principales

### Gestion des Enseignants
- Enregistrement des enseignants avec leurs informations personnelles
- Gestion des contrats (pourcentage de profit, nombre de sessions, heures)
- Profil enseignant pour visualiser les cours assignés
- Système de confirmation de paiement

### Gestion des Cours
- Création et configuration des cours (nom, prix, durée, horaire)
- Attribution des salles et des enseignants
- Suivi des inscriptions

### Gestion des Étudiants
- Enregistrement des étudiants
- Inscription aux cours
- Système de promotion/réduction
- Profil étudiant pour visualiser les cours suivis

### Gestion des Organisations
- Enregistrement des organisations avec leurs informations
- Gestion des participants (ajout, modification, suppression)
- Inscription des participants aux cours
- Tarification spéciale et système de facturation
- Profil organisation pour gérer les participants et visualiser les cours

### Suivi des Présences
- Enregistrement des présences pour chaque session
- Rapports de présence

### Gestion Financière
- Calcul automatique des paiements mensuels aux enseignants
- Suivi des paiements et confirmations

## Architecture du Projet

### Version Web (MERN Stack)
- **Frontend**: React.js avec Material-UI
- **Backend**: Node.js avec Express
- **Base de données**: MongoDB
- **Authentication**: JWT

### Version Mobile
- **Framework**: React Native
- **API**: Partage de l'API backend avec la version web

## Structure du Projet

```
FORMAJOY/
├── client/                 # Frontend React
├── server/                 # Backend Node.js/Express
├── mobile/                 # Application mobile React Native
└── docs/                   # Documentation
```

## Démarrage du Développement

1. Définir les modèles de données
2. Développer l'API RESTful
3. Créer les interfaces utilisateur web
4. Développer l'application mobile
5. Implémenter les tests
6. Déployer l'application

## Collaboration

Ce projet est développé en collaboration entre développeurs web et mobile.