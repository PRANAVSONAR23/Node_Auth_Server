// src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import env from './config/env.js';
import { errorHandler, notFound } from './middlewares/error.middleware.js';
import { globalLimiter } from './middlewares/rateLimit.middleware.js';
import authRoutes from './routes/auth.routes.js';
import { logger } from './utils/logger.utils.js';

// Initialize express app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(globalLimiter);

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// 404 handler
app.use(notFound);

// Error handler - Fix by explicitly typing as an error-handling middleware
app.use(errorHandler as unknown as express.ErrorRequestHandler);

// Start server
const PORT = env.PORT || 8000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
});

export default app;