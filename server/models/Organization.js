const mongoose = require('mongoose');
const User = require('./User');

// Schéma pour les organisations, étend le schéma utilisateur
const OrganizationSchema = new mongoose.Schema({
  nomOrganisation: {
    type: String,
    required: [true, 'Le nom de l\'organisation est requis'],
    trim: true
  },
  secteurActivite: {
    type: String,
    required: [true, 'Le secteur d\'activité est requis']
  },
  telephone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis']
  },
  adresse: {
    type: String,
    required: [true, 'L\'adresse est requise']
  },
  personneContact: {
    type: String,
    required: [true, 'Le nom de la personne de contact est requis']
  },
  emailContact: {
    type: String,
    required: [true, 'L\'email de contact est requis'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Veuillez fournir un email valide'
    ]
  },
  promotionApplicable: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant'
  }],
  cours: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  paiements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  }]
});

// Création du modèle Organization en utilisant la discrimination
const Organization = User.discriminator('Organization', OrganizationSchema);

module.exports = Organization;