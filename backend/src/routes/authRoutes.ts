import { login, register } from '../controllers/authController.js';
import { getUsers } from '../controllers/adminController.js';
import { ServerRoute, Request, ResponseToolkit } from '@hapi/hapi';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import Joi from 'joi';

export const authRoutes: ServerRoute[] = [
    { 
        method: 'POST', 
        path: '/api/login', 
        handler:  login,
        options: {
            tags: ['api', 'auth'],
            description: 'Login user and return JWT token',
            notes: 'Logs in a user with email and password, and returns a JWT token for authentication.',
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required().description('User email'),
                    password: Joi.string().min(1).required().description('User password (min 6 characters)'),
                }),
            },
        response: {
            schema: Joi.object({
            success: Joi.boolean().example(true),
            message: Joi.string().example('Login successful'),
            user: Joi.object({
                id: Joi.number().example(1),
                name: Joi.string().example('John Doe'),
                email: Joi.string().email().example('johndoe@example.com'),
                phone: Joi.string().example('9876543210'), 
                reset_token: Joi.string().allow(null).example(null), 
            reset_token_expiry: Joi.any().allow(null), 
            role: Joi.string().example('user'),
        }),
        token: Joi.string().example(
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDMwODQ1NzIsImV4cCI6MTc0MzA4ODE3Mn0.YZwpqOpqW8_RxzZ9NFsRkX8AJD3KxF8q7OagT7u8kqA'),

                }),
            },
        },
    },
    {
        method: 'POST',
        path: '/api/register',
        handler: async (request: Request, h: ResponseToolkit) => register(request, h),
        options: {
            tags: ['api', 'auth'],
            description: 'Register a new user',
            notes: 'Creates a new user and returns success message.',
            validate: {
                payload: Joi.object({
                    name: Joi.string().min(3).required().description('Full name of the user'),
                    email: Joi.string().email().required().description('Valid email address'),
                    password: Joi.string().min(6).required().description('Password (min 6 characters)'), 
                    confirmPassword: Joi.string()
                        .valid(Joi.ref('password'))
                        .required()
                        .description('Must match password')
                        .example('yourpassword123'), 
                    phone: Joi.string().min(10).max(15).required().description('User phone number'),
                }),
            },

            response: {
                schema: Joi.object({
                    success: Joi.boolean().example(true),
                    message: Joi.string().example('User registered successfully'),
                    user: Joi.object({
                        id: Joi.number().example(1),
                        name: Joi.string().example('John Doe'),
                        email: Joi.string().email().example('johndoe@example.com'),
                        role: Joi.string().example('user'),
                    }),
                    token: Joi.string().example(
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huZG9lQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NDMwODUyOTUsImV4cCI6MTc0MzA4ODg5NX0.aBCdEfGhIjKLmNoPQrStUvWxYz'
                    ),
                }),
            }

        },
    },
    {
        method: 'POST', 
        path: '/api/admin/users', 
        handler: async (request: Request, h: ResponseToolkit) => getUsers(request, h),
        options: { 
            pre: [{ method: adminMiddleware, assign: 'adminValidation' }],
            tags: ['api', 'admin'],
            description: 'Fetch all users (Admin only)',
            notes: 'Only accessible by admin users. Returns a list of all users.',
            response: {
                schema: Joi.object({
                    success: Joi.boolean().example(true),
                    users: Joi.array().items(
                        Joi.object({
                            id: Joi.number().example(1),
                            name: Joi.string().example('John Doe'),
                            email: Joi.string().email().example('johndoe@example.com'),
                            role: Joi.string().example('user'),
                        })
                    ),
                }),
            }

        },
    }
];
