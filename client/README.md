# Client FormaJOY

Interface utilisateur pour le système de gestion FormaJOY.

## Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la version de production
npm run preview
```

## Structure du projet

```
client/
├── public/              # Fichiers statiques
├── src/                 # Code source
│   ├── components/      # Composants réutilisables
│   ├── pages/           # Pages de l'application
│   ├── context/         # Contextes React (auth, etc.)
│   ├── services/        # Services API
│   ├── utils/           # Utilitaires
│   ├── App.jsx          # Composant principal
│   └── main.jsx         # Point d'entrée
├── index.html           # Page HTML principale
├── vite.config.js       # Configuration Vite
└── package.json         # Dépendances et scripts
```

## Technologies utilisées

- React.js
- Vite
- React Router
- Material-UI
- Axios
- JWT pour l'authentification
