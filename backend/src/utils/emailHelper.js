import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "y78123685@gmail.com",
        pass: "zmpo dgzd oegx ambf"
    }
});

export const sendEmail = async (to, subject, text) => {
    await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
};
