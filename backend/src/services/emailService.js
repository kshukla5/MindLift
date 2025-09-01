const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const emailService = {
  // Send welcome email to new speakers
  async sendSpeakerWelcomeEmail(speakerEmail, speakerName) {
    const msg = {
      to: speakerEmail,
      from: process.env.FROM_EMAIL || 'noreply@mindlift.com',
      subject: 'Welcome to MindLift - Your Speaker Journey Begins!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Welcome to MindLift, ${speakerName}!</h2>
          <p>Thank you for joining MindLift as a speaker. We're excited to have you share your knowledge and expertise with our community.</p>
          
          <h3>Next Steps:</h3>
          <ol>
            <li>Complete your speaker profile</li>
            <li>Upload your introduction video</li>
            <li>Add your social media links</li>
            <li>Submit for admin review</li>
          </ol>
          
          <p>Once your profile is approved, you'll be able to start uploading educational content and connecting with learners.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin-top: 0;">Important Guidelines:</h4>
            <ul>
              <li>Ensure all content is educational and appropriate</li>
              <li>Provide clear video descriptions and tags</li>
              <li>Engage respectfully with the learning community</li>
            </ul>
          </div>
          
          <p>If you have any questions, feel free to reach out to our support team.</p>
          
          <p>Best regards,<br>The MindLift Team</p>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      console.log('Welcome email sent successfully to:', speakerEmail);
      return { success: true };
    } catch (error) {
      console.error('Error sending welcome email:', error.response?.body || error.message);
      return { success: false, error: error.message };
    }
  },

  // Send approval notification email
  async sendSpeakerApprovalEmail(speakerEmail, speakerName) {
    const msg = {
      to: speakerEmail,
      from: process.env.FROM_EMAIL || 'noreply@mindlift.com',
      subject: 'Congratulations! Your MindLift Speaker Profile is Approved',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Congratulations, ${speakerName}!</h2>
          <p>Your speaker profile has been approved and you're now an official MindLift educator!</p>
          
          <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="margin-top: 0; color: #065f46;">You can now:</h3>
            <ul>
              <li>Upload educational videos</li>
              <li>Share your expertise with learners</li>
              <li>Build your teaching portfolio</li>
              <li>Track your content performance</li>
            </ul>
          </div>
          
          <p>Start by uploading your first educational video in your speaker dashboard.</p>
          
          <p>Welcome to the MindLift community of educators!</p>
          
          <p>Best regards,<br>The MindLift Team</p>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      console.log('Approval email sent successfully to:', speakerEmail);
      return { success: true };
    } catch (error) {
      console.error('Error sending approval email:', error.response?.body || error.message);
      return { success: false, error: error.message };
    }
  },

  // Send rejection notification email
  async sendSpeakerRejectionEmail(speakerEmail, speakerName, reason = '') {
    const msg = {
      to: speakerEmail,
      from: process.env.FROM_EMAIL || 'noreply@mindlift.com',
      subject: 'MindLift Speaker Application Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Speaker Application Update</h2>
          <p>Hello ${speakerName},</p>
          <p>Thank you for your interest in becoming a MindLift speaker. After careful review, we're unable to approve your application at this time.</p>
          
          ${reason ? `
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <h4 style="margin-top: 0;">Feedback:</h4>
              <p>${reason}</p>
            </div>
          ` : ''}
          
          <p>You're welcome to reapply in the future. Please ensure your profile meets our community guidelines and quality standards.</p>
          
          <p>Thank you for your understanding.</p>
          
          <p>Best regards,<br>The MindLift Team</p>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      console.log('Rejection email sent successfully to:', speakerEmail);
      return { success: true };
    } catch (error) {
      console.error('Error sending rejection email:', error.response?.body || error.message);
      return { success: false, error: error.message };
    }
  },

  // Send admin notification for new speaker applications
  async sendAdminNotificationEmail(adminEmail, speakerName, speakerEmail) {
    const msg = {
      to: adminEmail,
      from: process.env.FROM_EMAIL || 'noreply@mindlift.com',
      subject: 'New Speaker Application - Action Required',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">New Speaker Application</h2>
          <p>A new speaker has submitted their application for review.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Speaker Details:</h3>
            <p><strong>Name:</strong> ${speakerName}</p>
            <p><strong>Email:</strong> ${speakerEmail}</p>
          </div>
          
          <p>Please review their application in the admin dashboard and take appropriate action.</p>
          
          <p>Best regards,<br>MindLift System</p>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      console.log('Admin notification email sent successfully');
      return { success: true };
    } catch (error) {
      console.error('Error sending admin notification email:', error.response?.body || error.message);
      return { success: false, error: error.message };
    }
  },

  // Send general notification email
  async sendNotificationEmail(to, subject, content) {
    const msg = {
      to,
      from: process.env.FROM_EMAIL || 'noreply@mindlift.com',
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">MindLift Notification</h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${content}
          </div>
          <p>Best regards,<br>The MindLift Team</p>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      console.log('Notification email sent successfully to:', to);
      return { success: true };
    } catch (error) {
      console.error('Error sending notification email:', error.response?.body || error.message);
      return { success: false, error: error.message };
    }
  }
};

module.exports = emailService;
