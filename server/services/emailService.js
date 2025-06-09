import axios from 'axios';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import pkg from 'jsonwebtoken';
const { sign } = pkg;

dotenv.config();

// Simplified version without Bull queue for now - direct API calls
const verifyEmailWithHunter = async (email) => {
    try {
        const apiKey = process.env.HUNTER_API_KEY;

        if (!apiKey) {
            console.warn('Hunter API key not configured, skipping email verification');
            return true; // Allow signup to continue if API key is missing
        }

        console.log(`Verifying email with Hunter.io: ${email}`);

        const url = `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${apiKey}`;

        const response = await axios.get(url, {
            timeout: 15000, // 15 seconds timeout
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'EmailVerificationService/1.0'
            }
        });

        console.log('Hunter.io response:', response.data);

        if (response.data && response.data.data) {
            const result = response.data.data.result;
            const status = response.data.data.status;

            console.log(`Email verification result: ${result}, status: ${status}`);

            // Consider email valid if it's deliverable or if we can't determine (to avoid blocking users)
            const isValid = result === 'deliverable' || result === 'risky' || status === 'valid';

            return isValid;
        }

        // If response structure is unexpected, allow the email (don't block users)
        console.warn('Unexpected Hunter.io response structure, allowing email');
        return true;

    } catch (error) {
        console.error('Hunter.io API error:', error.message);

        // Handle specific error cases
        if (error.code === 'ECONNABORTED') {
            console.error('Hunter.io API timeout - allowing email to proceed');
        } else if (error.response) {
            console.error('Hunter.io API response error:', error.response.status, error.response.data);
        } else if (error.request) {
            console.error('Hunter.io API request error - no response received');
        }

        // Don't block user registration if email verification fails
        // In production, you might want to log this for monitoring
        return true;
    }
};

const sendVerificationEmail = async (user) => {
    try {
        // Validate input
        if (!user || !user.email || !user._id) {
            throw new Error('Invalid user object provided');
        }

        // Validate environment variables
        const requiredEnvVars = ['SECRET_STR', 'EMAIL_USER', 'EMAIL_PASS', 'BASE_URL'];
        for (const envVar of requiredEnvVars) {
            if (!process.env[envVar]) {
                throw new Error(`${envVar} environment variable is not set`);
            }
        }

        // First verify email deliverability (with timeout handling)
        console.log(`Checking email deliverability for: ${user.email}`);

        let isValid = true; // Default to true to not block users

        try {
            // Set a timeout for the entire email verification process
            const verificationPromise = verifyEmailWithHunter(user.email);
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Email verification timeout')), 20000)
            );

            isValid = await Promise.race([verificationPromise, timeoutPromise]);
        } catch (verificationError) {
            console.warn('Email verification failed or timed out:', verificationError.message);
            console.log('Proceeding with email send anyway to not block user registration');
            isValid = true; // Allow email sending even if verification fails
        }

        if (!isValid) {
            console.log(`Email ${user.email} is not deliverable. Skipping email send.`);
            return { success: false, reason: 'Email not deliverable' };
        }

        console.log(`Email ${user.email} verification passed. Sending verification email.`);

        // Generate JWT token
        const token = sign({ id: user._id }, process.env.SECRET_STR, { expiresIn: '24h' });

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            secure: true,
            tls: {
                rejectUnauthorized: false
            }
        });

        // Verify transporter configuration
        console.log('Verifying email transporter...');
        await transporter.verify();
        console.log('Email transporter verified successfully');

        const mailOptions = {
            from: {
                name: 'Oulamouna',
                address: process.env.EMAIL_USER
            },
            to: user.email,
            subject: 'Verify Your Email Address',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #3B4A3B; margin-bottom: 10px;">Email Verification</h1>
                        <p style="color: #666; font-size: 16px;">Please verify your email address to complete your registration</p>
                    </div>
                    
                    <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                        <p style="color: #3B4A3B; font-size: 16px; margin-bottom: 20px;">Hello ${user.firstName || 'there'},</p>
                        <p style="color: #3B4A3B; font-size: 16px; margin-bottom: 30px;">
                            Thank you for signing up! Please click the button below to verify your email address:
                        </p>
                        
                        <div style="text-align: center;">
                            <a href="${process.env.BASE_URL}/api/users/verify-email/${token}" 
                               style="background-color: #FFF2D6; color: #3B4A3B; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px; font-weight: bold;">
                                Verify My Email
                            </a>
                        </div>
                    </div>
                    
                    <div style="border-top: 1px solid #eee; padding-top: 20px;">
                        <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                            <strong>Important:</strong> This verification link will expire in 24 hours.
                        </p>
                        <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
                            If the button doesn't work, click this link directly :
                        </p>
                        <p style="color: #3B4A3B; font-size: 14px; word-break: break-all;">
                            ${process.env.BASE_URL}/api/users/verify-email/${token}
                        </p>
                        <p style="color: #666; font-size: 14px; margin-top: 20px;">
                            If you didn't create an account, please ignore this email.
                        </p>
                    </div>
                </div>
            `,
            text: `
Hello ${user.firstName || 'there'},

Thank you for signing up! Please verify your email address by visiting the following link:

${process.env.BASE_URL}/api/users/verify-email/${token}

This link will expire in 24 hours.

If you didn't create an account, please ignore this email.
            `.trim()
        };

        console.log(`Sending verification email to: ${user.email}`);
        const info = await transporter.sendMail(mailOptions);
        console.log(`Verification email sent successfully. Message ID: ${info.messageId}`);

        return {
            success: true,
            message: 'Verification email sent successfully',
            messageId: info.messageId
        };

    } catch (error) {
        console.error('Error in sending verification email:', error.message);
        console.error('Stack trace:', error.stack);
        return { success: false, error: error.message };
    }
};

// Optional: Validate email format before calling Hunter.io
const isValidEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Optional: Check if email domain exists (lightweight check)
const checkEmailDomain = async (email) => {
    const domain = email.split('@')[1];
    try {
        const dns = await import('dns');
        return new Promise((resolve) => {
            dns.resolveMx(domain, (err, addresses) => {
                resolve(!err && addresses && addresses.length > 0);
            });
        });
    } catch (error) {
        console.log('DNS check not available in this environment');
        return true; // Default to true if DNS check fails
    }
};

export { verifyEmailWithHunter, sendVerificationEmail, isValidEmailFormat, checkEmailDomain };