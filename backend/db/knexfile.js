import dotenv from 'dotenv';
dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.dev'
});

const isProduction = process.env.NODE_ENV === 'production';

export default {
  client: 'pg',
  connection: isProduction
    ? process.env.DATABASE_URL
    : {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
      },
  migrations: {
    directory: './db/migrations',
  },
  seeds: {
    directory: './db/seeds',
  }
};
