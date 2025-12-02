import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import dashboardJwtAuthRoutes from './routes/dashboard/auth/jwt/jwtAuthRoutes.js';
import portalJwtAuthRoutes from './routes/portal/auth/jwt/jwtAuthRoutes.js';
import dashboardGoogleAuthRoutes from './routes/dashboard/auth/google/googleAuthRoutes.js';
import portalGoogleAuthRoutes from './routes/portal/auth/google/googleAuthRoutes.js';
import portalPhoneAuthRoutes from './routes/portal/auth/phone/phoneAuthRoutes.js';
import dashboardContestRoutes from './routes/dashboard/contest.routes.js';
import dashboardProblemRoutes from './routes/dashboard/problem.routes.js';
import { serverMessages } from './constant/messages.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: serverMessages.healthOk });
});

// API Routes - Dashboard (Admin)
app.use('/api/dashboard/auth/jwt', dashboardJwtAuthRoutes);
app.use('/api/dashboard/auth/google', dashboardGoogleAuthRoutes);
app.use('/api/dashboard/contests', dashboardContestRoutes);
app.use('/api/dashboard/problems', dashboardProblemRoutes);

// API Routes - Portal (User)
app.use('/api/portal/auth/jwt', portalJwtAuthRoutes);
app.use('/api/portal/auth/google', portalGoogleAuthRoutes);
app.use('/api/portal/auth/phone', portalPhoneAuthRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: serverMessages.routeNotFound
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: serverMessages.internalError,
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database: ${process.env.DATABASE_URL?.split('@')[1] || 'Not configured'}`);
});

export default app;
