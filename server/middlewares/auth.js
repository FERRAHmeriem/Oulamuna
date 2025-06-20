import pkg from 'jsonwebtoken';
const { verify } = pkg;
import asyncHandler from "express-async-handler";
import { User } from "../models/schemas/user.js";
import CustomError from "../utils/customError.js";

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {

        token = req.headers.authorization.split(" ")[1];
        const decodedToken = verify(token, process.env.SECRET_STR);
        req.user = await User.findById(decodedToken.id).select("-password");
        next();

    }
    if (!token) {
        const error = new CustomError('Not authorized!, Please provide a valid token!', 400)
        return next(error)
    }
});

export default protect;