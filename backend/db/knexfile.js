import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Serve per ottenere il percorso della cartella attuale, perché __dirname non funziona con type: module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// trova il file .env.dev
const envPath = path.resolve(__dirname, '../.env.dev');

// Determina quale file .env caricare
dotenv.config({
  path: process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../.env.production')
    : envPath,
});

// debug psw
console.log('[DEBUG] Password caricata:', process.env.DB_PASSWORD);
console.log('[DEBUG] URL Supabase:', process.env.DATABASE_URL);

const LOCAL_DB_CONFIG = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeds'),
  },
};

const PRODUCTION_DB_CONFIG = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: path.resolve(__dirname, 'migrations'),
  },
  seeds: {
    directory: path.resolve(__dirname, 'seeds'),
  },
};

const config = process.env.NODE_ENV === 'production' ? PRODUCTION_DB_CONFIG : LOCAL_DB_CONFIG;

export default config;
