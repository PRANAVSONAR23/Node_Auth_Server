import jwt from 'jsonwebtoken';
import { createError } from '../utils/error.utils.js';
import env from '../config/env.js';
import prisma from '../config/database.js';
export const jwtAuthMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(createError('Access denied. No token provided', 401));
        }
        const token = authHeader.split(' ')[1];
        // Verify token
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
        // Get user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });
        if (!user) {
            return next(createError('User not found', 404));
        }
        if (!user.isVerified) {
            return next(createError('Please verify your email to access this resource', 403));
        }
        // Attach user to request object
        req.user = user;
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return next(createError('Token expired', 401));
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return next(createError('Invalid token', 401));
        }
        next(error);
    }
};
