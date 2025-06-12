const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const VideoController = require('../controllers/videoController');
const authorizeRoles = require('../middleware/authMiddleware');

router.get('/admin/stats', authorizeRoles('admin'), AdminController.getStats);
router.patch(
  '/admin/videos/:id/approval',
  authorizeRoles('admin'),
  VideoController.updateApproval,
);
router.delete(
  '/admin/videos/:id',
  authorizeRoles('admin'),
  VideoController.remove,
);

module.exports = router;
