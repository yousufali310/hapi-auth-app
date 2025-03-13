import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

const createUsersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(15) UNIQUE NOT NULL,
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
