const express = require('express');
const router = express.Router();
const SpeakerController = require('../controllers/speakerController');
const authorizeRoles = require('../middleware/authMiddleware');

router.get('/speakers', SpeakerController.list);
router.get('/speakers/:id', SpeakerController.getById);
router.get('/speaker/dashboard', authorizeRoles('speaker', 'admin'), SpeakerController.getDashboard);
router.get('/speaker/debug', authorizeRoles('speaker', 'admin'), SpeakerController.debugSpeakerData);
router.post('/speakers', authorizeRoles('admin'), SpeakerController.create);
router.put('/speakers/:id', authorizeRoles('admin'), SpeakerController.update);
router.delete('/speakers/:id', authorizeRoles('admin'), SpeakerController.remove);

module.exports = router;
