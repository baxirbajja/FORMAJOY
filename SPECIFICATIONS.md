# Spécifications du Projet FormaJOY

## 1. Vue d'ensemble

FormaJOY est un système de gestion complet pour centres de formation, disponible en version web (MERN stack) et mobile. Le système permet la gestion des enseignants, des cours, des étudiants, des présences et des paiements.

## 2. Utilisateurs et Rôles

### Administrateur
- Gestion complète des enseignants (ajout, modification, suppression)
- Création et configuration des cours
- Enregistrement des étudiants et des organisations
- Application des promotions/réductions
- Suivi des présences
- Gestion des paiements aux enseignants
- Attribution des identifiants de connexion

### Enseignant
- Consultation de son profil
- Visualisation des cours assignés
- Consultation de son historique de paiements
- Confirmation des paiements reçus

### Étudiant
- Consultation de son profil
- Visualisation des cours auxquels il est inscrit

### Organisation
- Consultation de son profil
- Gestion des participants
- Visualisation des cours auxquels elle est inscrite
- Consultation de son historique de paiements

## 3. Modèles de Données

### Utilisateur
- ID
- Nom
- Prénom
- Email
- Mot de passe (hashé)
- Rôle (Admin, Enseignant, Étudiant, Organisation)
- Date de création

### Enseignant (étend Utilisateur)
- Téléphone
- Adresse
- Spécialité
- Pourcentage de profit
- Heures disponibles
- Sessions par semaine
- Statut (actif/inactif)

### Étudiant (étend Utilisateur)
- Téléphone
- Adresse
- Date de naissance
- Promotion applicable (pourcentage)

### Organisation (étend Utilisateur)
- Nom de l'organisation
- Secteur d'activité
- Téléphone
- Adresse
- Personne de contact
- Email de contact
- Promotion applicable (pourcentage)
- Liste des participants (références)

### Participant
- ID
- Organisation (référence)
- Nom
- Prénom
- Email
- Téléphone
- Poste/Fonction
- Cours inscrits (références)

### Cours
- ID
- Nom
- Description
- Prix
- Prix spécial organisation
- Durée totale (heures)
- Date de début
- Date de fin
- Horaire (jours et heures)
- Salle
- Enseignant assigné (référence)
- Statut (planifié, en cours, terminé)
- Liste des étudiants inscrits (références)
- Liste des organisations inscrites (références)
- Liste des participants inscrits (références)

### Session
- ID
- Cours (référence)
- Date
- Heure de début
- Heure de fin
- Statut (planifiée, complétée, annulée)

### Présence
- ID
- Session (référence)
- Étudiant/Participant (référence)
- Type (étudiant individuel, participant d'organisation)
- Statut (présent, absent, retard)
- Commentaire

### Paiement
- ID
- Type (enseignant, organisation)
- Référence (enseignant ou organisation)
- Montant
- Mois concerné
- Date de paiement
- Statut (en attente, confirmé)
- Méthode de paiement
- Facture (référence)

## 4. Fonctionnalités Détaillées

### Gestion des Enseignants
- Enregistrement avec informations personnelles et professionnelles
- Configuration du contrat (pourcentage, sessions, heures)
- Suivi des cours assignés
- Calcul automatique des paiements mensuels
- Système de confirmation de paiement

### Gestion des Cours
- Création avec paramètres complets
- Attribution des salles et enseignants
- Planification des sessions
- Suivi des inscriptions (étudiants individuels et organisations)
- Gestion du statut du cours
- Tarification spéciale pour les organisations

### Gestion des Étudiants
- Enregistrement complet
- Inscription aux cours
- Application de promotions personnalisées
- Suivi des paiements

### Gestion des Organisations
- Enregistrement complet avec informations de l'entreprise
- Gestion des participants (ajout, modification, suppression)
- Inscription des participants aux cours
- Application de tarifs spéciaux et promotions
- Facturation et suivi des paiements

### Suivi des Présences
- Enregistrement pour chaque session (étudiants et participants d'organisations)
- Visualisation des absences
- Rapports de présence par organisation

### Gestion Financière
- Calcul des revenus par cours
- Calcul des paiements aux enseignants
- Facturation des organisations
- Suivi des confirmations de paiement
- Rapports financiers détaillés par type de client (individuel/organisation)

## 5. Interfaces Utilisateur

### Version Web
- Interface d'administration complète
- Tableaux de bord spécifiques par rôle
- Formulaires de gestion
- Rapports et statistiques
- Responsive design

### Version Mobile
- Fonctionnalités essentielles adaptées au mobile
- Interface simplifiée
- Notifications push

## 6. API RESTful

L'API sera structurée autour des ressources principales :
- /api/auth - Authentification
- /api/users - Gestion des utilisateurs
- /api/teachers - Gestion des enseignants
- /api/students - Gestion des étudiants
- /api/organizations - Gestion des organisations
- /api/participants - Gestion des participants d'organisations
- /api/courses - Gestion des cours
- /api/sessions - Gestion des sessions
- /api/attendance - Gestion des présences
- /api/payments - Gestion des paiements
- /api/invoices - Gestion des factures

## 7. Sécurité

- Authentification JWT
- Hashage des mots de passe
- Contrôle d'accès basé sur les rôles
- Validation des données
- Protection contre les attaques courantes (XSS, CSRF)

## 8. Étapes de Développement

### Phase 1: Préparation et Configuration
- Mise en place de l'environnement de développement
- Configuration des dépendances
- Création des modèles de données

### Phase 2: Développement Backend
- Implémentation de l'API RESTful
- Mise en place de l'authentification
- Développement des fonctionnalités principales

### Phase 3: Développement Frontend Web
- Création des interfaces utilisateur
- Intégration avec l'API
- Tests d'utilisabilité

### Phase 4: Développement Mobile
- Adaptation des fonctionnalités pour mobile
- Développement de l'interface mobile
- Synchronisation avec le backend

### Phase 5: Tests et Déploiement
- Tests d'intégration
- Correction des bugs
- Déploiement de la version initiale

## 9. Technologies Recommandées

### Frontend Web
- React.js
- Redux pour la gestion d'état
- Material-UI pour les composants
- Axios pour les requêtes HTTP
- Chart.js pour les visualisations

### Backend
- Node.js avec Express
- MongoDB avec Mongoose
- JWT pour l'authentification
- Bcrypt pour le hashage
- Multer pour la gestion des fichiers

### Mobile
- Flutter
- Provider/Bloc pour la gestion d'état
- Flutter Navigation
- Dio pour les requêtes HTTP
- SharedPreferences pour le stockage local

## 10.  pour la Collaboration

- Utiliser Git pour le contrôle de version
- Documenter l'API pour faciliter l'intégration mobile
