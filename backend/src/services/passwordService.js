import crypto from 'crypto';
import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import { sendEmail } from '../utils/emailHelper.js';

export const requestPasswordReset = async (email) => {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) throw new Error('User not found');

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); 

    await pool.query('UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3', 
        [resetToken, resetTokenExpiry, email]);

    const resetUrl = `http://localhost:5173/confirm-password/${resetToken}`;
    await sendEmail(email, 'Password Reset Request', `Click the link to reset your password: ${resetUrl}`);

    return { message: 'Password reset email sent' };
};

export const resetPassword = async (token, newPassword) => {
    const user = await pool.query('SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()', [token]);
    if (user.rows.length === 0) throw new Error('Invalid or expired reset token');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
        [hashedPassword, user.rows[0].id]);

    return { message: 'Password reset successful' , success: true };
};
