import * as passwordController from '../controllers/passwordController.js';
import { ServerRoute } from '@hapi/hapi'; 
import Joi from 'joi';


export const passwordRoutes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/api/forgot-password',
        handler: passwordController.requestReset,
        options: {
            description: 'Request a password reset',
            notes: 'Sends a reset password email if the user exists',
            tags: ['api', 'auth'],
            validate: {
                payload: Joi.object({   
                    email: Joi.string().email().required().description('User email for password reset')
                })
            },
            response: {
                status: {
                    200: Joi.object({
                        message: Joi.string().example('Password reset email sent')
                    }).description('Success response'),
                    404: Joi.object({
                        message: Joi.string().example('User not found')
                    }).description('User not found'),
                    500: Joi.object({
                        message: Joi.string().example('Internal Server Error')
                    }).description('Server error'),
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/api/reset-password/{token}',
        handler: passwordController.resetPassword,
        options: {
            description: 'Reset user password',
            notes: 'Allows a user to reset their password using a valid token',
            tags: ['api', 'auth'],
            validate: {
                params: Joi.object({
                    token: Joi.string().required().description('Password reset token')
                }),
                payload: Joi.object({
                   password: Joi.string().min(1).required().description('Password (min 6 characters)'), 
                    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
                                            .description('Must match password')
                                           .example('yourpassword123'), 
                }).label('ResetPasswordPayload')
            },
            response: {
                status: {
                    200: Joi.object({
                        message: Joi.string().example('Password reset successful'),
                        success: Joi.boolean().example(true)
                    }).description('Success response'),
                    400: Joi.object({
                        message: Joi.string().example('Invalid or expired token')
                    }).description('Invalid token or mismatch in password confirmation'),
                    500: Joi.object({
                        message: Joi.string().example('Internal Server Error')
                    }).description('Server error'),
                }
            }
        }
    }
];
