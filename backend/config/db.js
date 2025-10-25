import pg from "pg";
import dotenv from 'dotenv';
dotenv.config();

console.log('=== DB CONFIG DEBUG ===');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB:', process.env.DB);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD, 'Type:', typeof process.env.DB_PASSWORD);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('=== END DEBUG ===');

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB,
  password: String(process.env.DB_PASSWORD),
  port: process.env.DB_PORT,
});

export default pool;