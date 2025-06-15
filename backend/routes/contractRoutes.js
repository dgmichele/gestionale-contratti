import express from 'express';
import {
  getContracts,
  createContract,
  updateContract,
  deleteContract
} from '../controllers/contractController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🔐 Tutte queste rotte sono protette dal middleware JWT
router.get('/contratti', authenticateToken, getContracts);
router.post('/contratti', authenticateToken, createContract);
router.put('/contratti/:id', authenticateToken, updateContract);
router.delete('/contratti/:id', authenticateToken, deleteContract);

export default router;