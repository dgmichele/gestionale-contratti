import jwt from 'jsonwebtoken';
import db from '../db.js';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token mancante' });
  }

  try {
    // Verifica che il token sia valido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verifica se il token è stato invalidato (blacklist)
    const isBlacklisted = await db('blacklisted_tokens').where({ token }).first();
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Token non più valido (logout)' });
    }

    // Aggiunge i dati utente alla richiesta
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token non valido' });
  }
}