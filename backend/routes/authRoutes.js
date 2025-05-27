import express from 'express';
import { register } from '../controllers/authController.js';
import { login } from '../controllers/authController.js';
import { getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotta POST /register
router.post('/register', register);
// Rotta POST /login
router.post('/login', login);
// GET /me
router.get('/me', authenticateToken, getMe);

export default router;
