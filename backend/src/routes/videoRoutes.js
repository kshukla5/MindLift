const express = require('express');
const multer = require('multer');
const path = require('path');
const authorizeRoles = require('../middleware/authMiddleware');
const VideoController = require('../controllers/videoController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/videos', VideoController.list);
router.get('/videos/unapproved', authorizeRoles('admin'), VideoController.listUnapproved);
router.get('/speaker/videos', authorizeRoles('speaker', 'admin'), VideoController.getSpeakerVideos);
router.get('/speaker/stats', authorizeRoles('speaker', 'admin'), VideoController.getSpeakerStats);
router.get('/learner/dashboard', authorizeRoles('subscriber', 'speaker', 'admin'), VideoController.getLearnerDashboard);
router.get('/videos/:id', VideoController.getById);
router.post('/videos', authorizeRoles('speaker', 'admin'), upload.single('videoFile'), VideoController.create);
router.put('/videos/:id', VideoController.update);
router.patch('/videos/:id/approval', authorizeRoles('admin'), VideoController.updateApproval);
router.delete('/videos/:id', VideoController.remove);

module.exports = router;
