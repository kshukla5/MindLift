const express = require('express');
const router = express.Router();
const BookmarkController = require('../controllers/bookmarkController');
const authorizeRoles = require('../middleware/authMiddleware');

router.get('/bookmarks', authorizeRoles('user', 'speaker', 'admin'), BookmarkController.list);
router.post('/bookmarks', authorizeRoles('user', 'speaker', 'admin'), BookmarkController.add);
router.delete('/bookmarks/:videoId', authorizeRoles('user', 'speaker', 'admin'), BookmarkController.remove);
router.get('/bookmarks/dashboard', authorizeRoles('user', 'speaker', 'admin'), BookmarkController.getLearnerDashboard);

module.exports = router;
