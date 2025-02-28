import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import env from '../config/env.js';
export const generateTokens = async (userId, ipAddress, userAgent) => {
    // Create token payload
    const payload = { userId };
    // Generate access token
    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: parseInt(env.JWT_ACCESS_EXPIRY, 10)
    });
    // Generate refresh token
    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: parseInt(env.JWT_REFRESH_EXPIRY, 10)
    });
    // Calculate expiry date for refresh token
    const refreshExpiry = new Date();
    refreshExpiry.setDate(refreshExpiry.getDate() + 7); // 7 days from now
    // Save refresh token to database
    await prisma.token.create({
        data: {
            refreshToken,
            ipAddress,
            userAgent,
            expiresAt: refreshExpiry,
            userId
        }
    });
    return { accessToken, refreshToken };
};
export const verifyRefreshToken = async (token) => {
    // Verify token signature
    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
    // Check if token exists in database and is valid
    const refreshToken = await prisma.token.findFirst({
        where: {
            refreshToken: token,
            isValid: true,
            expiresAt: { gt: new Date() }
        }
    });
    if (!refreshToken) {
        throw new Error('Invalid refresh token');
    }
    return decoded.userId;
};
export const invalidateRefreshToken = async (token) => {
    await prisma.token.update({
        where: { refreshToken: token },
        data: { isValid: false }
    });
};
export const invalidateAllUserTokens = async (userId) => {
    await prisma.token.updateMany({
        where: { userId },
        data: { isValid: false }
    });
};
