const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const VideoController = require('../controllers/videoController');
const authorizeRoles = require('../middleware/authMiddleware');

router.get('/admin/stats', authorizeRoles('admin'), AdminController.getStats);

// Video approval routes
router.patch('/admin/videos/:id/approval', authorizeRoles('admin'), VideoController.updateApproval);
router.post('/admin/videos/:videoId/approve', authorizeRoles('admin'), AdminController.approveVideo);
router.post('/admin/videos/:videoId/reject', authorizeRoles('admin'), AdminController.rejectVideo);
router.delete('/admin/videos/:id', authorizeRoles('admin'), VideoController.remove);

// Speaker approval routes
router.post('/admin/speakers/:speakerId/approve', authorizeRoles('admin'), AdminController.approveSpeaker);
router.post('/admin/speakers/:speakerId/reject', authorizeRoles('admin'), AdminController.rejectSpeaker);

module.exports = router;
