import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Registrazione
export async function register(req, res) {
  try {
    // debug
    console.log('Dati ricevuti dal client:', req.body);

    const { nome, email, password } = req.body;

    // Validazione di base
    if (!nome || !email || !password) {
      return res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
    }

    // Verifica se esiste già un utente con questa email
    const existingUser = await db('utenti').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({ message: 'Email già registrata.' });
    }

    // Criptiamo la password con bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Inseriamo il nuovo utente nel database
    await db('utenti').insert({
      nome,
      email,
      password_hash: hashedPassword,
    });

    res.status(201).json({ message: 'Registrazione completata con successo!' });
  } catch (error) {
    console.error('Errore nella registrazione:', error);
    res.status(500).json({ message: 'Errore interno del server.' });
  }
}

// Login
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log('📥 Login ricevuto:', email);

    // Cerca utente nel database
    const utente = await db('utenti').where({ email }).first();

    if (!utente) {
      return res.status(400).json({ error: 'Email o password non validi' });
    }

    // Confronta la password con quella hashata
    const passwordValida = await bcrypt.compare(password, utente.password_hash);
    if (!passwordValida) {
      return res.status(400).json({ error: 'Email o password non validi' });
    }

    // Genera il token JWT
    const token = jwt.sign(
      { id: utente.id, nome: utente.nome },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ message: 'Login riuscito', token });
  } catch (error) {
    console.error('Errore nel login:', error);
    res.status(500).json({ error: 'Errore interno nel login' });
  }
}