import express from 'express';
import { register } from '../controllers/authController.js';
import { login } from '../controllers/authController.js';
import { logout } from '../controllers/authController.js';
import { getMe } from '../controllers/authController.js';
import { refresh } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotta POST /register
router.post('/register', register);
// Rotta POST /login
router.post('/login', login);
// Rotta POST /logout
router.post('/logout', authenticateToken, logout);
// Rotta GET /me
router.get('/me', authenticateToken, getMe);
// Rotta Post /refresh
router.post('/refresh', refresh);

export default router;
