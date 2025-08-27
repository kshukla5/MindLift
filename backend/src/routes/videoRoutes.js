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
router.get('/videos/:id', VideoController.getVideoById);
router.get('/speaker/videos', authorizeRoles('speaker'), VideoController.getSpeakerVideos);
router.post('/videos', authorizeRoles('speaker', 'admin'), upload.single('videoFile'), VideoController.create);
router.patch('/videos/:id', authorizeRoles('speaker', 'admin'), VideoController.update);
router.delete('/videos/:id', authorizeRoles('speaker', 'admin'), VideoController.remove);

module.exports = router;
