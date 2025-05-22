import knexConfig from './db/knexfile.js';
import knex from 'knex';

const db = knex(knexConfig);
export default db;

