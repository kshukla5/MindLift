const express = require('express');
const router = express.Router();
const BookmarkController = require('../controllers/bookmarkController');
const authorizeRoles = require('../middleware/authMiddleware');

router.get('/bookmarks', authorizeRoles('subscriber', 'speaker', 'admin'), BookmarkController.list);
router.post('/bookmarks', authorizeRoles('subscriber', 'speaker', 'admin'), BookmarkController.add);
router.delete('/bookmarks/:videoId', authorizeRoles('subscriber', 'speaker', 'admin'), BookmarkController.remove);
router.get('/bookmarks/dashboard', authorizeRoles('subscriber', 'speaker', 'admin'), BookmarkController.getLearnerDashboard);

module.exports = router;
