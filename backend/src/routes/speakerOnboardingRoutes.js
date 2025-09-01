const express = require('express');
const router = express.Router();
const SpeakerModel = require('../models/speakerModel');
const UserModel = require('../models/userModel');
const NotificationModel = require('../models/notificationModel');
const emailService = require('../services/emailService');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'profilePicture') {
      // Allow images only
      const allowedTypes = /jpeg|jpg|png|gif|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for profile pictures'));
      }
    } else if (file.fieldname === 'introVideo') {
      // Allow videos only
      const allowedTypes = /mp4|avi|mov|wmv|flv|webm/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error('Only video files are allowed for intro videos'));
      }
    }
  }
});

const SpeakerOnboardingController = {
  // Step 1: Get profile completion status
  async getProfileStatus(req, res) {
    try {
      const userId = req.user.id;
      const user = await UserModel.findById(userId);
      
      if (user.role !== 'speaker') {
        return res.status(403).json({ error: 'Access denied. Speaker role required.' });
      }

      const profileStatus = await SpeakerModel.getProfileCompletionStatus(userId);
      
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.email_verified,
          country: user.country,
          profileCompleted: user.profile_completed
        },
        profileStatus
      });
    } catch (err) {
      console.error('getProfileStatus error:', err);
      res.status(500).json({ error: 'Failed to get profile status', details: err.message });
    }
  },

  // Step 2: Update basic profile information
  async updateBasicProfile(req, res) {
    try {
      const userId = req.user.id;
      const { fullName, bio, areasOfExpertise, country } = req.body;

      if (!fullName || !bio || !areasOfExpertise || areasOfExpertise.length === 0) {
        return res.status(400).json({ 
          error: 'Full name, bio, and areas of expertise are required' 
        });
      }

      // Update user country if provided
      if (country) {
        await UserModel.updateUser(userId, { country });
      }

      // Get or create speaker profile
      let speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
      if (!speakerId) {
        speakerId = await SpeakerModel.ensureSpeakerRow(userId);
      }

      // Update speaker profile
      const updatedSpeaker = await SpeakerModel.updateSpeaker(speakerId, {
        fullName,
        bio,
        expertise: areasOfExpertise
      });

      // Check if profile is now complete
      const profileStatus = await SpeakerModel.getProfileCompletionStatus(userId);
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        speaker: updatedSpeaker,
        profileStatus
      });
    } catch (err) {
      console.error('updateBasicProfile error:', err);
      res.status(500).json({ error: 'Failed to update profile', details: err.message });
    }
  },

  // Step 3: Upload profile picture and intro video
  async uploadMedia(req, res) {
    try {
      const userId = req.user.id;
      const files = req.files;
      
      let speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
      if (!speakerId) {
        return res.status(400).json({ error: 'Speaker profile not found. Please complete basic profile first.' });
      }

      const updateData = {};
      
      if (files.profilePicture && files.profilePicture[0]) {
        const profilePictureUrl = `/uploads/${files.profilePicture[0].filename}`;
        updateData.profilePictureUrl = profilePictureUrl;
      }
      
      if (files.introVideo && files.introVideo[0]) {
        const introVideoUrl = `/uploads/${files.introVideo[0].filename}`;
        updateData.introVideoUrl = introVideoUrl;
      }

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const updatedSpeaker = await SpeakerModel.updateSpeaker(speakerId, updateData);
      const profileStatus = await SpeakerModel.getProfileCompletionStatus(userId);

      res.json({
        success: true,
        message: 'Media uploaded successfully',
        speaker: updatedSpeaker,
        profileStatus,
        uploadedFiles: {
          profilePicture: updateData.profilePictureUrl,
          introVideo: updateData.introVideoUrl
        }
      });
    } catch (err) {
      console.error('uploadMedia error:', err);
      res.status(500).json({ error: 'Failed to upload media', details: err.message });
    }
  },

  // Step 4: Add social media links
  async updateSocialLinks(req, res) {
    try {
      const userId = req.user.id;
      const { socialLinks } = req.body;

      let speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
      if (!speakerId) {
        return res.status(400).json({ error: 'Speaker profile not found.' });
      }

      const updatedSpeaker = await SpeakerModel.updateSpeaker(speakerId, {
        socialLinks
      });

      const profileStatus = await SpeakerModel.getProfileCompletionStatus(userId);

      // If profile is now complete, mark user as profile completed
      if (profileStatus.completed) {
        await UserModel.updateProfileCompleted(userId, true);
      }

      res.json({
        success: true,
        message: 'Social links updated successfully',
        speaker: updatedSpeaker,
        profileStatus
      });
    } catch (err) {
      console.error('updateSocialLinks error:', err);
      res.status(500).json({ error: 'Failed to update social links', details: err.message });
    }
  },

  // Submit profile for admin review
  async submitForReview(req, res) {
    try {
      const userId = req.user.id;
      
      const profileStatus = await SpeakerModel.getProfileCompletionStatus(userId);
      
      if (!profileStatus.completed) {
        return res.status(400).json({ 
          error: 'Profile incomplete. Please complete all required fields.',
          missing: profileStatus.missing
        });
      }

      let speakerId = await SpeakerModel.getSpeakerIdByUserId(userId);
      if (!speakerId) {
        return res.status(400).json({ error: 'Speaker profile not found.' });
      }

      // Update approval status to pending if it's not already submitted
      const speaker = await SpeakerModel.getSpeakerById(speakerId);
      if (speaker.approval_status === 'pending') {
        return res.status(400).json({ error: 'Profile already submitted for review.' });
      }

      await SpeakerModel.updateSpeakerApproval(speakerId, 'pending');
      
      // Create notification for admin
      await NotificationModel.createNotification({
        userId: 1, // Assuming admin user ID is 1
        type: 'speaker_review_needed',
        title: 'New Speaker Profile for Review',
        message: `${req.user.name} has submitted their speaker profile for review.`,
        data: { speaker_id: speakerId, user_id: userId }
      });

      // Send welcome email to speaker
      await emailService.sendSpeakerWelcomeEmail(req.user.email, req.user.name);

      // Send admin notification email (assuming admin email is set)
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@mindlift.com';
      await emailService.sendAdminNotificationEmail(adminEmail, req.user.name, req.user.email);

      res.json({
        success: true,
        message: 'Profile submitted for admin review! You will receive an email notification once approved.',
        status: 'pending_approval'
      });
    } catch (err) {
      console.error('submitForReview error:', err);
      res.status(500).json({ error: 'Failed to submit for review', details: err.message });
    }
  }
};

// Routes
router.get('/profile/status', authMiddleware, SpeakerOnboardingController.getProfileStatus);
router.put('/profile/basic', authMiddleware, SpeakerOnboardingController.updateBasicProfile);
router.post('/profile/media', authMiddleware, upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'introVideo', maxCount: 1 }
]), SpeakerOnboardingController.uploadMedia);
router.put('/profile/social', authMiddleware, SpeakerOnboardingController.updateSocialLinks);
router.post('/profile/submit', authMiddleware, SpeakerOnboardingController.submitForReview);

module.exports = router;
