const mongoose = require('mongoose');
const User = require('./User');

// Schéma pour les enseignants, étend le schéma utilisateur
const TeacherSchema = new mongoose.Schema({
  telephone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis']
  },
  adresse: {
    type: String,
    required: [true, 'L\'adresse est requise']
  },
  specialite: {
    type: String,
    required: [true, 'La spécialité est requise']
  },
  pourcentageProfit: {
    type: Number,
    required: [true, 'Le pourcentage de profit est requis'],
    min: 0,
    max: 100
  },
  heuresDisponibles: {
    type: [{
      jour: {
        type: String,
        enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
      },
      debut: String,
      fin: String
    }]
  },
  sessionsParSemaine: {
    type: Number,
    default: 0
  },
  statut: {
    type: String,
    enum: ['actif', 'inactif'],
    default: 'actif'
  },
  cours: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  paiements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }]
});

// Création du modèle Teacher en utilisant la discrimination
const Teacher = User.discriminator('Teacher', TeacherSchema);

module.exports = Teacher;