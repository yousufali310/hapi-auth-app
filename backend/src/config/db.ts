import pkg from 'pg';

import dotenv from 'dotenv';


dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
  process.exit(1);
});

const createUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(15)  NOT NULL,
            password TEXT NOT NULL,
            reset_token TEXT,
            reset_token_expiry TIMESTAMP
        );
    `;

    try {
        await pool.query(query);
        console.log('Users table checked/created successfully.');
    } catch (error) {
        console.error('Error creating table:', error);
    }
};

createUsersTable();

export default pool;
