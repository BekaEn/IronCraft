import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  createAdminUser,
  makeUserAdmin
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Development routes
router.post('/create-admin', createAdminUser);
router.post('/make-admin', makeUserAdmin);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfile);

export default router;
