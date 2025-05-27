import express from 'express';
import {
  getContratti,
  createContratto,
  updateContratto,
  deleteContratto
} from '../controllers/contractController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🔐 Tutte queste rotte sono protette dal middleware JWT
router.get('/contratti', authenticateToken, getContratti);
router.post('/contratti', authenticateToken, createContratto);
router.put('/contratti/:id', authenticateToken, updateContratto);
router.delete('/contratti/:id', authenticateToken, deleteContratto);

export default router;