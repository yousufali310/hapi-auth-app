import pool from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { log } from 'console';

dotenv.config();

interface RegisterUserInput {
    name: string;
    email: any;
    password: any;
    confirmPassword: any;
    phone: any;
}

interface LoginUserInput {
    email: string;
    password: string;
}

export const registerUser = async ({ name, email, password, confirmPassword, phone }: RegisterUserInput) => {
    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await pool.connect();
    try {
        const result = await client.query(
            'INSERT INTO users (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id, email',
            [name, email, hashedPassword, phone]
        );
        const user = result.rows[0];

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { user, token };
    } finally {
        client.release();
    }
};

export const loginUser = async ({ email, password }: LoginUserInput) => {
    const client = await pool.connect();
    
    try {
        const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { user, token };
    } finally {
        client.release();
    }
};
