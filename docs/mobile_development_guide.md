# Guide de Développement Mobile FormaJOY

## Introduction

Ce guide est destiné aux développeurs mobiles travaillant sur la version mobile de FormaJOY. Il fournit toutes les informations nécessaires pour comprendre l'architecture du projet et implémenter les fonctionnalités requises.

## Architecture du Projet

### Structure des Dossiers

```
mobile/
  ├── src/
  │   ├── contexts/      # Contextes React (Auth, etc.)
  │   ├── screens/       # Écrans de l'application
  │   ├── components/    # Composants réutilisables
  │   ├── services/      # Services API
  │   ├── utils/         # Utilitaires
  │   └── styles/        # Styles globaux
  └── App.js             # Point d'entrée
```

### Composants Principaux

1. **AuthContext**
   - Gestion de l'authentification
   - Stockage du token JWT
   - Gestion des rôles utilisateur

2. **Écrans**
   - TeachersScreen - Liste des enseignants
   - TeacherProfileScreen - Profil détaillé d'un enseignant
   - CoursesScreen - Liste des cours
   - CourseDetailScreen - Détails d'un cours
   - StudentsScreen - Liste des étudiants
   - StudentProfileScreen - Profil d'un étudiant
   - AttendanceScreen - Gestion des présences
   - PaymentsScreen - Gestion des paiements

## Endpoints API

### Authentification

```
POST /api/auth/login
POST /api/auth/register
GET /api/auth/me
```

### Enseignants

```
GET /api/teachers
GET /api/teachers/:id
POST /api/teachers
PUT /api/teachers/:id
DELETE /api/teachers/:id
```

### Cours

```
GET /api/courses
GET /api/courses/:id
GET /api/courses/teacher/:teacherId
POST /api/courses
PUT /api/courses/:id
DELETE /api/courses/:id
```

### Étudiants

```
GET /api/students
GET /api/students/:id
POST /api/students
PUT /api/students/:id
DELETE /api/students/:id
```

### Présences

```
GET /api/attendance/session/:sessionId
POST /api/attendance
PUT /api/attendance/:id
```

### Paiements

```
GET /api/payments
GET /api/payments/:id
POST /api/payments
PUT /api/payments/:id
```

## Modèles de Données

### Utilisateur

```typescript
interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'enseignant' | 'etudiant' | 'organisation';
  telephone?: string;
  adresse?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Enseignant

```typescript
interface Teacher extends User {
  specialite: string;
  pourcentageProfit: number;
  salaire: number;
  heuresDisponibles: Array<{
    jour: string;
    debut: string;
    fin: string;
  }>;
  sessionsParSemaine: number;
  statut: 'actif' | 'inactif';
}
```

### Cours

```typescript
interface Course {
  _id: string;
  nom: string;
  description: string;
  prix: number;
  dureeHeures: number;
  dateDebut: Date;
  dateFin: Date;
  salle: string;
  enseignant: string; // ID de l'enseignant
  horaire: Array<{
    jour: string;
    heureDebut: string;
    heureFin: string;
  }>;
  statut: 'planifie' | 'en_cours' | 'termine';
}
```

## Gestion des États

### Exemple avec Context

```javascript
// AuthContext.js
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      // Stocker le token et les informations utilisateur
      setUser(user);
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Autres méthodes d'authentification...

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Styles et Thème

```javascript
// styles/theme.js
export const theme = {
  colors: {
    primary: '#1a237e',
    secondary: '#4CAF50',
    error: '#f44336',
    background: '#f5f5f5',
    text: '#333',
    textLight: '#666',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};
```

## Bonnes Pratiques

1. **Gestion des Erreurs**
   - Utiliser try/catch pour les appels API
   - Afficher des messages d'erreur appropriés
   - Gérer les erreurs de réseau

2. **Performance**
   - Implémenter la pagination pour les listes
   - Mettre en cache les données appropriées
   - Optimiser les images et les assets

3. **Sécurité**
   - Valider les entrées utilisateur
   - Sécuriser le stockage des tokens
   - Implémenter la déconnexion automatique

4. **Tests**
   - Écrire des tests unitaires pour les composants
   - Tester les appels API
   - Tester les cas d'erreur

## Déploiement

1. **Préparation**
   - Vérifier les variables d'environnement
   - Optimiser les assets
   - Mettre à jour les dépendances

2. **Build**
   ```bash
   npm run build
   ```

3. **Tests de Production**
   - Tester sur différents appareils
   - Vérifier les performances
   - Valider les fonctionnalités critiques

## Support

Pour toute question technique ou assistance :
- Consulter la documentation API complète
- Contacter l'équipe backend
- Utiliser le système de suivi des problèmes