import db from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Registrazione
export async function register(req, res) {
  try {
    // debug
    // console.log('Dati ricevuti dal client:', req.body);

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

    // Cerca l'utente
    const user = await db('utenti').where({ email }).first();

    if (!user) {
      return res.status(400).json({ message: 'Email o password non validi' });
    }
    // Verifica password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: 'Email o password non validi' });
    }
    // Genera Access Token 
    const accessToken = jwt.sign({ id: user.id, nome: user.nome },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Genera Refresh Token 
    const refreshToken = jwt.sign({ id: user.id },
      process.env.JWT_SECRET_REFRESH,
      { expiresIn:'30d' }
    );

    // Salva il refresh_token nel db
    await db('refresh_tokens').insert({ token: refreshToken, utente_id: user.id });

    res.json({ message:'Login riuscito!', access_token:accessToken, refresh_token:refreshToken });

  } catch (error) {
    console.error('Errore nel login!', error);
    res.status(500).json({ message:'Errore interno nel login' });
  }
}

// Logout
export async function logout(req, res) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const refresh = req.body?.refresh_token;

    if (refresh) {
      // Elimina dalla tabella refresh_tokens
      await db('refresh_tokens').where({ token: refresh }).del();
    }

    if (!token) {
      return res.status(400).json({ message: 'Token mancante' });
    }

    // Salva il token nella blacklist
    await db('blacklisted_tokens').insert({ token });

    res.json({ message: 'Logout effettuato con successo' });
  } catch (err) {
    console.error('Errore nel logout:', err);
    res.status(500).json({ message: 'Errore durante il logout' });
  }
}

// Ottieni l'utente che fa l'accesso
export async function getMe(req, res) {
  try {
    const user = await db('utenti')
      .select('id', 'nome', 'email') // escludiamo la password
      .where({ id: req.user.id })
      .first();

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    res.json(user);
  } catch (err) {
    console.error('Errore in GET /me:', err);
    res.status(500).json({ message: 'Errore nel recupero dei dati utente' });
  }
}

// Refresh del token
export async function refresh(req, res) {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ message:'È richiesto il refresh_token' });
    }
  
    // Verifica se refresh_token è nel db
    const tokenDb = await db('refresh_tokens').where({ token: refresh_token }).first();

    if (!tokenDb) {
      return res.status(403).json({ message:'Refresh Token non valido o revocato' });
    }
  
    // Verifica il refresh_token
    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET_REFRESH);
  
    // Genera nuovo access_token
    const newAccess = jwt.sign({ id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn:'15m' }
    );
  
    res.json({ access_token: newAccess });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message:'Errore nel refresh del token' });
  }
}