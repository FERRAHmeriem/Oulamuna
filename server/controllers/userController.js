import { User, findOne } from '../models/schemas/user.js';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import { isValidEmailFormat, sendVerificationEmail } from '../services/emailService.js';
import asyncHandler from 'express-async-handler';
import CustomError from '../utils/customError.js';


// JWT token generation function
const signToken = id => {
    return sign({ id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES,
    });
};

export const signupStepOne = asyncHandler(async (req, res, next) => {
    const { firstName, familyName, email, password } = req.body;

    // Input validation
    if (!firstName || !familyName || !email || !password) {
        const error = new CustomError('All fields are required: firstName, familyName, email, password', 400);
        return next(error);
    }

    // Email format validation
    if (!isValidEmailFormat(email)) {
        const error = new CustomError('Please provide a valid email address format', 400);
        return next(error);
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if the email already exists
    console.log(`Checking if email exists: ${normalizedEmail}`);
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        const error = new CustomError('Email already exists!', 400);
        return next(error);
    }

    console.log('Email is available, proceeding with registration');

    // Create user first, then handle email verification
    const userData = {
        firstName: firstName.trim(),
        familyName: familyName.trim(),
        email: normalizedEmail,
        password,
        isEmailVerified: false,
        createdAt: new Date()
    };

    console.log('Creating new user...');
    const user = new User(userData);
    await user.save();
    console.log(`User created successfully with ID: ${user._id}`);

    // Handle email verification asynchronously to avoid blocking the response
    console.log('Starting email verification process...');

    // Option 1: Quick response approach 
    // Send the response immediately and handle email verification in the background
    res.status(201).json({
        message: 'Account created successfully! We are sending you a verification email.',
        userId: user._id,
        email: user.email,
        step: 'email_verification_in_progress'
    });

    // Handle email verification in the background
    try {
        const emailResult = await sendVerificationEmail(user);
        if (emailResult.success) {
            console.log(`Verification email sent successfully to: ${user.email}`);
        } else {
            console.error(`Failed to send verification email to: ${user.email}`, emailResult.error);
        }
    } catch (emailError) {
        console.error('Background email sending error:', emailError);
    }

    /* 
    // Option 2: Wait for email verification (we use this if we need to wait -- OUMBA3D NCHOF WCH NKHAYAR)
    try {
        console.log('Verifying email deliverability...');
        
        // Set a timeout for the entire email verification process
        const emailVerificationPromise = sendVerificationEmail(user);
        const timeoutPromise = new Promise((resolve) => 
            setTimeout(() => resolve({ success: false, error: 'Verification timeout' }), 25000)
        );
        
        const emailResult = await Promise.race([emailVerificationPromise, timeoutPromise]);

        if (!emailResult.success) {
            console.warn('Email verification/sending failed:', emailResult.error || emailResult.reason);
            
            return res.status(201).json({ 
                message: 'Account created successfully, but there was an issue with email verification. You can request a new verification email later.',
                userId: user._id,
                emailSent: false,
                warning: emailResult.error || emailResult.reason || 'Email verification failed'
            });
        }

        console.log('Email verification and sending completed successfully');
        res.status(201).json({ 
            message: 'Account created successfully! Please check your email to verify your account.',
            userId: user._id,
            emailSent: true,
            email: user.email
        });

    } catch (emailError) {
        console.error('Email verification process error:', emailError);
        
        res.status(201).json({ 
            message: 'Account created successfully, but there was an issue sending the verification email. Please contact support or try to resend.',
            userId: user._id,
            emailSent: false,
            error: 'Email sending failed'
        });
    }
    */

}
);


export const signupStepTwo = asyncHandler(async (req, res, next) => {
    const { userId, birthday, sexe } = req.body;


    const user = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { birthday, sexe } },
        { new: true }
    );
    if (!user) {
        return next(new CustomError('User not found!', 404));
    }

    res.status(200).json({ message: 'Step two completed' });

})

export const signupStepThree = asyncHandler(async (req, res, next) => {
    const { userId, profileImage } = req.body;
    const user = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { profileImage } },
        { new: true }
    );
    if (!user) {
        return next(new CustomError('User not found!', 404));
    }

    res.status(200).json({ message: 'Step three completed' });

})

export const signupStepFour = asyncHandler(async (req, res) => {
    const { userId, userName } = req.body;
    const user = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { userName } },
        { new: true }
    );
    if (!user) {
        return next(new CustomError('User not found!', 404));
    }

    res.status(200).json({ message: 'Signup completed' });

})

export const login = asyncHandler(async (req, res, next) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        const error = new CustomError('Please provide your username & password for login in!', 400)
        return next(error)
    }
    const user = await findOne({ userName });
    if (!user) {
        const error = new CustomError('User not found!', 404)
        return next(error)
    }

    // Check if the user exists and password matches
    if (!(await user.matchPassword(password, user.password))) {
        const error = new CustomError('Invalid credentials!', 400)
        return next(error)
    }
    const token = signToken(user._id);

    //store the token in an HTTP-only cookie so JavaScript cannot access it (prevents XSS attacks)
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({ message: 'Logged in successfully' });

})


export const verifyEmail = asyncHandler(async (req, res) => {

    const { token } = req.params;
    const decoded = verify(token, process.env.SECRET_STR);


    const user = await User.findOneAndUpdate(
        { _id: decoded.id },
        { $set: { verified: true } },
        { new: true }
    );
    if (!user) {
        return next(new CustomError('User not found!', 404));
    }
    res.status(200).json({ message: 'Email verified successfully' });

});