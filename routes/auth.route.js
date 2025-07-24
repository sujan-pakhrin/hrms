import express from 'express';
import { register, login, changePassword } from '../controller/auth.controller.js';
import { protect, admin } from '../middleware/verify.token.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes
router.post('/register', protect, admin, register);
router.post('/change-password', protect, changePassword);

export default router