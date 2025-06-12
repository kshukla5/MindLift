const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authorizeRoles = require('../middleware/authMiddleware');

// Only admins can list all users
router.get('/users', authorizeRoles('admin'), UserController.list);
router.post('/signup', UserController.signup);
router.post('/login', UserController.login);

module.exports = router;
