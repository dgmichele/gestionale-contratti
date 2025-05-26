import express from 'express';
import { register } from '../controllers/authController.js';
import { login } from '../controllers/authController.js';

const router = express.Router();

// Rotta POST /register
router.post('/register', register);
// Rotta POST /login
router.post('/login', login);

export default router;
