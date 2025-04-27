const express = require('express');
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse, addStudentToCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.get('/', getCourses);
router.get('/:id', getCourse);

// Routes protégées
router.use(protect);

// Routes pour les cours (accès restreint)
router.post('/', authorize('admin'), createCourse);
router.put('/:id', authorize('admin'), updateCourse);
router.delete('/:id', authorize('admin'), deleteCourse);

// Route pour ajouter un étudiant à un cours
router.post('/:id/enroll', authorize('admin'), addStudentToCourse);

module.exports = router;