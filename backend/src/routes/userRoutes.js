const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authorizeRoles = require('../middleware/authMiddleware');

// Learner dashboard route
router.get('/learner/dashboard', authorizeRoles('user', 'user', 'speaker', 'admin'), UserController.getLearnerDashboard);

// Only admins can list all users
router.get('/users', authorizeRoles('admin'), UserController.list);
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.remove);

module.exports = router;
