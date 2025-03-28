import crypto from 'crypto';
import pool from '../config/db.js'; 
import bcrypt from 'bcrypt';
import { sendEmail } from '../utils/emailHelper.js';


import { QueryResult } from 'pg';

export interface User {
    id: number;
    email: string;
    reset_token?: string | null;
    reset_token_expiry?: Date | null;
}

export const requestPasswordReset = async (email: string) => {
    const result: QueryResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) throw new Error('User not found');

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); 

    await pool.query(
        'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
        [resetToken, resetTokenExpiry, email]
    );

    const resetUrl = `http://localhost:5173/confirm-password/${resetToken}`;
    await sendEmail({
            to: email,  
            subject: 'Password Reset Request',
            text: `Click the link to reset your password: ${resetUrl}`
        });

    return { message: 'Password reset email sent' };
};

export const resetPassword = async (token: string, newPassword: string) => {
    const result: QueryResult = await pool.query(
        'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
        [token]
    );
    if (result.rows.length === 0) throw new Error('Invalid or expired reset token');

    const user: User = result.rows[0];

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
        'UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
        [hashedPassword, user.id]
    );

    return { message: 'Password reset successful', success: true };
};