const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generate a secure random token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Email templates
const emailTemplates = {
  verification: (name, verificationUrl) => ({
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to BurnBlack!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
            Verify Email
          </a>
        </div>
        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated email, please do not reply.
        </p>
      </div>
    `
  }),
  verificationSuccess: (name, email) => ({
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Email verified successfully',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verified!</h2>
        <p>Hi ${name},</p>
        <p>Your email has been successfully verified. You can now use all features of BurnBlack.</p>
        <p>Thank you for verifying your email address.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This is an automated email, please do not reply.
        </p>
      </div>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const emailData = emailTemplates[template](data.name, data.verificationUrl);
    emailData.to = to; // Override template to with actual recipient
    
    const response = await sgMail.send(emailData);
    console.log('Email sent:', response[0].headers['x-message-id']);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw new Error('Failed to send email');
  }
};

module.exports = {
  generateToken,
  sendEmail,
  emailTemplates
}; 