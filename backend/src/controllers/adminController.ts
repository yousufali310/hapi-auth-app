import pool from '../config/db.js';
import { ResponseToolkit } from '@hapi/hapi';

export const getUsers = async (request: Request, h: ResponseToolkit) => {
    try {
        const result = await pool.query('SELECT id, name, email, role FROM users');
        return h.response({ users: result.rows }).code(200);
    } catch (err) {
        return h.response({ error: 'Failed to fetch users' }).code(500);
    }
}; 