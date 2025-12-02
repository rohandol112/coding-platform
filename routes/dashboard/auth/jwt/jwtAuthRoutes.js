import express from 'express';
import { registerController, loginController, profileController } from '../../../../controllers/dashboard/auth/jwt/jwtAuthController.js';

const router = express.Router();

// POST /api/dashboard/auth/jwt/register
router.post('/register', registerController);

// POST /api/dashboard/auth/jwt/login
router.post('/login', loginController);

// GET /api/dashboard/auth/jwt/profile
router.get('/profile', profileController);

export default router;
