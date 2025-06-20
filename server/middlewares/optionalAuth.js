import jwt from 'jsonwebtoken';
import { User } from '../models/schemas/user.js';
import asyncHandler from 'express-async-handler';
export const optionalAuth = asyncHandler(async (req, res, next) => {

    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = null;
        return next();
    }

    const token = authHeader.replace('Bearer ', '');

    const decoded = jwt.verify(token, process.env.SECRET_STR);
    const user = await User.findById(decoded.id || decoded._id);

    req.user = user;
    next();

});