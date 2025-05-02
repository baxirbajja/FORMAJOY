const Course = require('../models/Course');

// @desc    Obtenir tous les cours
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('enseignant', '_id nom prenom');

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des cours',
      error: error.message
    });
  }
};

// @desc    Obtenir un cours par ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('enseignant', 'nom prenom email specialite telephone')
      .populate('etudiantsInscrits', 'nom prenom email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du cours',
      error: error.message
    });
  }
};

// @desc    Créer un nouveau cours
// @route   POST /api/courses
// @access  Private/Admin
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du cours',
      error: error.message
    });
  }
};

// @desc    Mettre à jour un cours
// @route   PUT /api/courses/:id
// @access  Private/Admin
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du cours',
      error: error.message
    });
  }
};

// @desc    Supprimer un cours
// @route   DELETE /api/courses/:id
// @access  Private/Admin
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du cours',
      error: error.message
    });
  }
};

// @desc    Ajouter un étudiant à un cours
// @route   POST /api/courses/:id/students
// @access  Private/Admin
exports.addStudentToCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const { studentId } = req.body;

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    // Vérifier si l'étudiant est déjà inscrit au cours
    if (course.etudiantsInscrits.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'L\'étudiant est déjà inscrit à ce cours'
      });
    }

    // Ajouter l'étudiant à la liste des étudiants inscrits
    course.etudiantsInscrits.push(studentId);
    await course.save();

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'étudiant au cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de l\'étudiant au cours',
      error: error.message
    });
  }
};

// @desc    Supprimer un étudiant d'un cours
// @route   DELETE /api/courses/:id/students/:studentId
// @access  Private/Admin
exports.removeStudentFromCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    // Vérifier si l'étudiant est inscrit au cours
    if (!course.etudiantsInscrits.includes(req.params.studentId)) {
      return res.status(400).json({
        success: false,
        message: 'L\'étudiant n\'est pas inscrit à ce cours'
      });
    }

    // Retirer l'étudiant de la liste des étudiants inscrits
    course.etudiantsInscrits = course.etudiantsInscrits.filter(
      studentId => studentId.toString() !== req.params.studentId
    );
    await course.save();

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'étudiant du cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'étudiant du cours',
      error: error.message
    });
  }
};

// @desc    Obtenir les cours d'un enseignant
// @route   GET /api/courses/teacher/:id
// @access  Public
exports.getCoursesByTeacher = async (req, res) => {
  try {
    const courses = await Course.find({ enseignant: req.params.id })
      .populate('enseignant', 'nom prenom email specialite telephone');

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des cours de l\'enseignant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des cours de l\'enseignant',
      error: error.message
    });
  }
};

// @desc    Obtenir les étudiants d'un cours
// @route   GET /api/courses/:id/students
// @access  Public
exports.getStudentsByCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('etudiantsInscrits', 'nom prenom email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Cours non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      count: course.etudiantsInscrits.length,
      data: course.etudiantsInscrits
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants du cours:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des étudiants du cours',
      error: error.message
    });
  }
};

// @desc    Obtenir les cours d'un étudiant
// @route   GET /api/courses/student/:id
// @access  Public
exports.getCoursesByStudent = async (req, res) => {
  try {
    const courses = await Course.find({ etudiantsInscrits: req.params.id })
      .populate('enseignant', 'nom prenom email specialite telephone');

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des cours de l\'étudiant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des cours de l\'étudiant',
      error: error.message
    });
  }
};
