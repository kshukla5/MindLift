const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const authorizeRoles = require('../middleware/authMiddleware');

router.get('/admin/stats', authorizeRoles('admin'), AdminController.getStats);

module.exports = router;
