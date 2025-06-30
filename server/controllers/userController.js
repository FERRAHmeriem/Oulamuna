import { User, findOne } from '../models/schemas/user.js';
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import { isValidEmailFormat, sendVerificationEmail } from '../services/emailService.js';
import asyncHandler from 'express-async-handler';
import CustomError from '../utils/customError.js';
import { deleteFile, generateFileUrl } from '../utils/fileUtils.js';


// JWT token generation function
const signToken = id => {
    return sign({ id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES,
    });
};

export const signup = asyncHandler(async (req, res, next) => {
    const { firstName, familyName, email, password, birthday, sexe, userName } = req.body;

    // Input validation - tous les champs requis
    if (!firstName || !familyName || !email || !password || !birthday || !sexe || !userName) {
        // Clean up uploaded file if validation fails
        if (req.file) {
            deleteFile(req.file.filename);
        }
        const error = new CustomError('All fields are required: firstName, familyName, email, password, birthday, sexe, userName', 400);
        return next(error);
    }

    // Email format validation
    if (!isValidEmailFormat(email)) {
        // Clean up uploaded file if validation fails
        if (req.file) {
            deleteFile(req.file.filename);
        }
        const error = new CustomError('Please provide a valid email address format', 400);
        return next(error);
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if the email already exists
    console.log(`Checking if email exists: ${normalizedEmail}`);
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        // Clean up uploaded file if user already exists
        if (req.file) {
            deleteFile(req.file.filename);
        }
        const error = new CustomError('Email already exists!', 400);
        return next(error);
    }

    console.log('Email is available, proceeding with registration');

    // Prepare user data with all information
    const userData = {
        firstName: firstName.trim(),
        familyName: familyName.trim(),
        email: normalizedEmail,
        password,
        birthday,
        sexe,
        userName,
        isEmailVerified: false,
        createdAt: new Date()
    };

    // Handle profile image if uploaded
    if (req.file) {
        userData.profileImage = req.file.filename;
    }

    console.log('Creating new user with complete profile...');
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
        profileImage: user.profileImage || null,
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
                profileImage: user.profileImage || null,
                emailSent: false,
                warning: emailResult.error || emailResult.reason || 'Email verification failed'
            });
        }

        console.log('Email verification and sending completed successfully');
        res.status(201).json({ 
            message: 'Account created successfully! Please check your email to verify your account.',
            userId: user._id,
            profileImage: user.profileImage || null,
            emailSent: true,
            email: user.email
        });

    } catch (emailError) {
        console.error('Email verification process error:', emailError);
        
        res.status(201).json({ 
            message: 'Account created successfully, but there was an issue sending the verification email. Please contact support or try to resend.',
            userId: user._id,
            profileImage: user.profileImage || null,
            emailSent: false,
            error: 'Email sending failed'
        });
    }
    */
});

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
    res.status(200).json({ message: 'Logged in successfully', user });

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


export const updateProfile = asyncHandler(async (req, res, next) => {
    const { firstName, familyName, email, birthday, sexe, userName } = req.body;
    const userId = req.params.userId;

    // Validate userId
    if (!userId) {
        // Clean up uploaded file if validation fails
        if (req.file) {
            deleteFile(req.file.filename);
        }
        const error = new CustomError('User ID is required', 400);
        return next(error);
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
        // Clean up uploaded file if user not found
        if (req.file) {
            deleteFile(req.file.filename);
        }
        return next(new CustomError('User not found!', 404));
    }

    // Prepare update data - only include fields that have values
    let updateData = {};
    let emailChanged = false;

    // Check each field and add to updateData if it has a value
    if (firstName && firstName.trim()) {
        updateData.firstName = firstName.trim();
    }

    if (familyName && familyName.trim()) {
        updateData.familyName = familyName.trim();
    }

    if (email && email.trim()) {
        const normalizedEmail = email.toLowerCase().trim();

        // Email format validation
        if (!isValidEmailFormat(normalizedEmail)) {
            // Clean up uploaded file if validation fails
            if (req.file) {
                deleteFile(req.file.filename);
            }
            const error = new CustomError('Please provide a valid email address format', 400);
            return next(error);
        }

        // Check if email is different from current email
        if (normalizedEmail !== existingUser.email) {
            // Check if the new email already exists for another user
            const emailExists = await User.findOne({
                email: normalizedEmail,
                _id: { $ne: userId } // Exclude current user
            });

            if (emailExists) {
                // Clean up uploaded file if email already exists
                if (req.file) {
                    deleteFile(req.file.filename);
                }
                const error = new CustomError('Email already exists for another user!', 400);
                return next(error);
            }

            updateData.email = normalizedEmail;
            updateData.isEmailVerified = false; // Reset email verification
            emailChanged = true;
        }
    }

    if (birthday) {
        updateData.birthday = birthday;
    }

    if (sexe) {
        updateData.sexe = sexe;
    }

    if (userName && userName.trim()) {
        // Check if username already exists for another user
        const usernameExists = await User.findOne({
            userName: userName.trim(),
            _id: { $ne: userId }
        });

        if (usernameExists) {
            // Clean up uploaded file if username already exists
            if (req.file) {
                deleteFile(req.file.filename);
            }
            const error = new CustomError('Username already exists for another user!', 400);
            return next(error);
        }

        updateData.userName = userName.trim();
    }

    // Handle profile image if uploaded
    if (req.file) {
        // Delete old profile image if it exists and is not default
        if (existingUser.profileImage &&
            existingUser.profileImage !== 'default-profile.png' &&
            !existingUser.profileImage.includes('default-profile.png')) {
            deleteFile(existingUser.profileImage);
        }

        updateData.profileImage = req.file.filename;
    }

    // Check if there's any data to update
    if (Object.keys(updateData).length === 0) {
        const error = new CustomError('No valid data provided for update', 400);
        return next(error);
    }

    // Update the user
    const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: updateData },
        { new: true }
    );

    console.log(`User profile updated successfully for ID: ${userId}`);

    // Generate profile image URL if exists
    const profileImageUrl = updatedUser.profileImage ?
        updatedUser.profileImage : null;

    // Prepare user data for response
    const userData = {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        familyName: updatedUser.familyName,
        email: updatedUser.email,
        userName: updatedUser.userName,
        birthday: updatedUser.birthday,
        sexe: updatedUser.sexe,
        profileImage: updatedUser.profileImage,
        isEmailVerified: updatedUser.isEmailVerified,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
    };

    // Prepare response
    let responseMessage = 'Profile updated successfully!';
    let responseData = {
        message: responseMessage,
        user: userData
    };

    // Handle email verification if email was changed
    if (emailChanged) {
        responseMessage = 'Profile updated successfully! We are sending you a verification email for your new email address.';
        responseData.message = responseMessage;
        responseData.emailChanged = true;
        responseData.emailVerificationInProgress = true;

        // Send response first
        res.status(200).json(responseData);

        // Handle email verification in the background
        try {
            const emailResult = await sendVerificationEmail(updatedUser);
            if (emailResult.success) {
                console.log(`Verification email sent successfully to new email: ${updatedUser.email}`);
            } else {
                console.error(`Failed to send verification email to new email: ${updatedUser.email}`, emailResult.error);
            }
        } catch (emailError) {
            console.error('Background email sending error for profile update:', emailError);
        }
    } else {
        // Send response for non-email updates
        res.status(200).json(responseData);
    }
});