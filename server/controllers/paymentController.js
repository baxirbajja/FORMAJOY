const Payment = require('../models/Payment');
const Course = require('../models/Course');
const Student = require('../models/Student');
const Organization = require('../models/Organization');
const Teacher = require('../models/Teacher');

// @desc    Obtenir tous les paiements
// @route   GET /api/payments
// @access  Private/Admin
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('cours', 'titre')
      .populate('etudiant', 'nom prenom')
      .populate('organisation', 'nom')
      .populate('enseignant', 'nom prenom');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des paiements',
      error: error.message
    });
  }
};

// @desc    Obtenir un paiement par ID
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('cours', 'titre description')
      .populate('etudiant', 'nom prenom')
      .populate('organisation', 'nom')
      .populate('enseignant', 'nom prenom');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du paiement',
      error: error.message
    });
  }
};

// @desc    Créer un nouveau paiement
// @route   POST /api/payments
// @access  Private/Admin
exports.createPayment = async (req, res) => {
  try {
    // Vérifier si le cours existe
    const course = await Course.findById(req.body.cours);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    // Vérifier si l'étudiant, l'organisation ou l'enseignant existe
    if (req.body.etudiant) {
      const student = await Student.findById(req.body.etudiant);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Étudiant non trouvé'
        });
      }
    } else if (req.body.organisation) {
      const organization = await Organization.findById(req.body.organisation);
      if (!organization) {
        return res.status(404).json({
          success: false,
          message: 'Organisation non trouvée'
        });
      }
    } else if (req.body.enseignant) {
      const teacher = await Teacher.findById(req.body.enseignant);
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Enseignant non trouvé'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Un étudiant, une organisation ou un enseignant doit être spécifié'
      });
    }

    // Générer un numéro de facture si nécessaire
    if (req.body.facture && !req.body.facture.numero) {
      req.body.facture.numero = `FAC-${Date.now()}`;
    }

    const payment = await Payment.create(req.body);

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Erreur lors de la création du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du paiement',
      error: error.message
    });
  }
};

// @desc    Mettre à jour un paiement
// @route   PUT /api/payments/:id
// @access  Private/Admin
exports.updatePayment = async (req, res) => {
  try {
    let payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du paiement',
      error: error.message
    });
  }
};

// @desc    Supprimer un paiement
// @route   DELETE /api/payments/:id
// @access  Private/Admin
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    await payment.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du paiement',
      error: error.message
    });
  }
};

// @desc    Obtenir les paiements d'un cours
// @route   GET /api/payments/course/:courseId
// @access  Private/Admin
exports.getPaymentsByCourse = async (req, res) => {
  try {
    const payments = await Payment.find({ cours: req.params.courseId })
      .populate('etudiant', 'nom prenom')
      .populate('organisation', 'nom')
      .populate('enseignant', 'nom prenom');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements du cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des paiements du cours',
      error: error.message
    });
  }
};

// @desc    Obtenir les paiements d'un étudiant
// @route   GET /api/payments/student/:studentId
// @access  Private/Admin
exports.getPaymentsByStudent = async (req, res) => {
  try {
    const payments = await Payment.find({ etudiant: req.params.studentId })
      .populate('cours', 'titre');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des paiements de l\'étudiant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des paiements de l\'étudiant',
      error: error.message
    });
  }
};

// @desc    Mettre à jour le statut d'un paiement
// @route   PUT /api/payments/:id/status
// @access  Private/Admin
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { statut } = req.body;

    if (!statut || !['en attente', 'confirmé', 'annulé'].includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Paiement non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut du paiement',
      error: error.message
    });
  }
};