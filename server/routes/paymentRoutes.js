const express = require('express');
const { getPayments, getPayment, createPayment, updatePayment, deletePayment, getPaymentsByCourse, getPaymentsByStudent, updatePaymentStatus } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Protection de toutes les routes
router.use(protect);

// Routes pour les paiements
router.route('/')
  .get(authorize('admin'), getPayments)
  .post(authorize('admin'), createPayment);

router.route('/:id')
  .get(authorize('admin'), getPayment)
  .put(authorize('admin'), updatePayment)
  .delete(authorize('admin'), deletePayment);

// Routes spécifiques
router.get('/course/:courseId', authorize('admin'), getPaymentsByCourse);
router.get('/student/:studentId', authorize('admin', 'etudiant'), getPaymentsByStudent);
router.put('/:id/status', authorize('admin'), updatePaymentStatus);

module.exports = router;