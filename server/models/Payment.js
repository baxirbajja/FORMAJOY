const mongoose = require('mongoose');

// Schéma pour les paiements
const PaymentSchema = new mongoose.Schema({
  montant: {
    type: Number,
    required: [true, 'Le montant du paiement est requis'],
    min: 0
  },
  datePaiement: {
    type: Date,
    default: Date.now
  },
  methodePaiement: {
    type: String,
    enum: ['espèces', 'chèque', 'virement', 'carte bancaire'],
    required: [true, 'La méthode de paiement est requise']
  },
  referencePaiement: {
    type: String
  },
  statut: {
    type: String,
    enum: ['en attente', 'confirmé', 'annulé'],
    default: 'en attente'
  },
  cours: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Le cours associé est requis']
  },
  etudiant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  organisation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
  enseignant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  description: {
    type: String
  },
  facture: {
    numero: String,
    dateEmission: Date,
    dateEcheance: Date
  }
}, {
  timestamps: true
});

// Validation pour s'assurer qu'un étudiant, une organisation ou un enseignant est spécifié
PaymentSchema.pre('validate', function(next) {
  if (!this.etudiant && !this.organisation && !this.enseignant) {
    this.invalidate('payeur', 'Un étudiant, une organisation ou un enseignant doit être spécifié');
  }
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);