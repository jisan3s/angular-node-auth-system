const nodemailer = require('nodemailer');

/**
 * Send a welcome email to a newly registered user
 * @param {string} email - Recipient email
 * @param {string} name - Recipient name
 */
const sendWelcomeEmail = async (email, name) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Welcome to Auth System!',
            html: `
                <h1>Welcome, ${name}!</h1>
                <p>Thank you for registering with our system.</p>
                <p>We are glad to have you on board.</p>
                <br>
                <p>Best regards,</p>
                <p>The Auth System Team</p>
            `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // We don't throw error here to avoid breaking the registration flow
        // if email fails but user creation was successful.
    }
};

/**
 * Send a reset password code email
 * @param {string} email - Recipient email
 * @param {string} code - 6-digit reset code
 */
const sendResetCodeEmail = async (email, code) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Password Reset Code',
            html: `
                <h1>Password Reset Code</h1>
                <p>Your password reset code is: <strong>${code}</strong></p>
                <p>This code will expire in 15 minutes.</p>
                <br>
                <p>If you did not request this, please ignore this email.</p>
                <p>Best regards,</p>
                <p>The Auth System Team</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Reset email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending reset email:', error);
    }
};

module.exports = { sendWelcomeEmail, sendResetCodeEmail };
