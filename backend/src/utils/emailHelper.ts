import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
    throw new Error('Missing EMAIL_USER or EMAIL_PASS in environment variables');
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPass
    }
});

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
}

export const sendEmail = async ({ to, subject, text }: EmailOptions): Promise<void> => {
    try {
        await transporter.sendMail({
            from: `"Support Team" <${emailUser}>`, 
            to,
            subject,
            text
        });
        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
