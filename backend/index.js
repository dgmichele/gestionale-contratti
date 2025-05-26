import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.dev'
});

console.log('🔐 JWT_SECRET:', process.env.JWT_SECRET);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.send('API pronta per partire!');
});

// Rotte
app.use(authRoutes); // Registrazione
 
// Avvio server
app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});
