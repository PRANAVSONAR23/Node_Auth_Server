import { AppError } from '../utils/error.utils.js';
import { logger } from '../utils/logger.utils.js';
import env from '../config/env.js';
export const errorHandler = (err, req, res, next) => {
    logger.error(err.message, err.stack);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        stack: env.NODE_ENV === 'development' ? err.stack : undefined
    });
};
export const notFound = (req, res, next) => {
    const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};
