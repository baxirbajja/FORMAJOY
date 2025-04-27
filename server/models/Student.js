const mongoose = require('mongoose');
const User = require('./User');

// Schéma pour les étudiants, étend le schéma utilisateur
const StudentSchema = new mongoose.Schema({
  telephone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis']
  },
  adresse: {
    type: String,
    required: [true, 'L\'adresse est requise']
  },
  dateNaissance: {
    type: Date,
    required: [true, 'La date de naissance est requise']
  },
  promotionApplicable: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  cours: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  presences: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendance'
  }],
  paiements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }]
});

// Création du modèle Student en utilisant la discrimination
const Student = User.discriminator('Student', StudentSchema);

module.exports = Student;