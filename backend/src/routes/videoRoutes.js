const express = require('express');
const multer = require('multer');
const path = require('path');
const authorizeRoles = require('../middleware/authMiddleware');
const VideoController = require('../controllers/videoController');

const router = express.Router();

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

// Video routes
router.get('/videos', VideoController.list);
router.get('/videos/unapproved', authorizeRoles('admin'), VideoController.listUnapproved);
router.get('/videos/:id', VideoController.getById);
router.post('/videos', authorizeRoles('speaker', 'admin', 'user'), upload.single('videoFile'), VideoController.create);
router.patch('/videos/:id', authorizeRoles('speaker', 'admin', 'user'), VideoController.update);
router.put('/videos/:id', authorizeRoles('speaker', 'admin', 'user'), VideoController.update);
router.patch('/videos/:id/approval', authorizeRoles('admin'), VideoController.updateApproval);
router.delete('/videos/:id', authorizeRoles('speaker', 'admin', 'user'), VideoController.remove);

// Serve uploaded videos
router.use('/uploads', express.static(uploadsDir));

module.exports = router;
