const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Routes d'authentification
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;