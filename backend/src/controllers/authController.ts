import * as authService from '../services/authService.js';
import { Request, ResponseToolkit } from '@hapi/hapi';

interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

export const register = async (request: Request, h: ResponseToolkit) => {
    try {
        const { user, token } = await authService.registerUser(request.payload as RegisterPayload);
        return h.response({ success: true, message: 'User registered successfully', user, token }).code(201);
    } catch (err) {
        return h.response({ success: false, error: (err as Error).message }).code(400);
    }
};

export const login = async (request: Request, h: ResponseToolkit) => {
    try {
        const { user, token } = await authService.loginUser(request.payload as LoginPayload);
        
        
        const response=  h.response({ success: true, message: 'Login successful', user, token }).code(200);
        
        return response;
        
    } catch (err) {
        return h.response({ success: false, error: (err as Error).message }).code(400);
    }
};
