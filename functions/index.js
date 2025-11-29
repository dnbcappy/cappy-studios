const functions = require('firebase-functions');
const {onRequest} = require('firebase-functions/v2/https');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
// CORS restricted to production domains
const cors = require('cors')({
  origin: [
    'https://cappystudios.dev',
    'https://cappy-studios.web.app',
    'https://cappy-studios.firebaseapp.com'
  ]
});

admin.initializeApp();

// Define secrets for Gmail credentials
const {defineSecret} = require('firebase-functions/params');
const gmailEmail = defineSecret('GMAIL_EMAIL');
const gmailPassword = defineSecret('GMAIL_PASSWORD');

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.toString().replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Contact Form Handler
 * Receives form submissions and sends email notifications
 */
exports.submitContactForm = onRequest(
  {secrets: [gmailEmail, gmailPassword]},
  (req, res) => {
  return cors(req, res, async () => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        message: 'Method not allowed. Use POST.'
      });
    }

    try {
      // Extract form data
      const { name, email, subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: name, email, and message are required.'
        });
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email address.'
        });
      }

      // Configure email transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailEmail.value(),
          pass: gmailPassword.value()
        }
      });

      // Sanitize inputs to prevent XSS in emails
      const safeName = escapeHtml(name);
      const safeEmail = escapeHtml(email);
      const safeSubject = escapeHtml(subject);
      const safeMessage = escapeHtml(message);

      // Format subject line
      const subjectLine = subject
        ? `[Cappy Studios Contact] ${safeSubject}`
        : '[Cappy Studios Contact] New Message';

      // Email content
      const mailOptions = {
        from: gmailEmail.value(),
        to: gmailEmail.value(), // Send to yourself
        replyTo: email, // Allow easy reply to sender
        subject: subjectLine,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #9333ea;">New Contact Form Submission</h2>
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>From:</strong> ${safeName}</p>
              <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
              ${subject ? `<p><strong>Subject:</strong> ${safeSubject}</p>` : ''}
            </div>
            <div style="background: white; padding: 20px; border-left: 4px solid #9333ea; margin: 20px 0;">
              <h3 style="margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap;">${safeMessage}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This email was sent from the Cappy Studios contact form at
              <a href="https://cappystudios.dev">cappystudios.dev</a>
            </p>
          </div>
        `
      };

      // Send email
      await transporter.sendMail(mailOptions);

      // Log successful submission
      console.log('Contact form submitted:', { name, email, subject });

      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Thank you for your message! I\'ll get back to you soon.'
      });

    } catch (error) {
      console.error('Error processing contact form:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while sending your message. Please try again later.'
      });
    }
  });
  }
);
