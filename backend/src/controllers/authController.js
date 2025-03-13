import * as authService from '../services/authService.js';

export const register = async (request, h) => {
    try {
        const { user, token } = await authService.registerUser(request.payload);
        return h.response({ success: true, message: 'User registered successfully', user, token }).code(201);
    } catch (err) {
        return h.response({ success: false, error: err.message }).code(400);
    }
};

export const login = async (request, h) => {
    try {
        const { user, token } = await authService.loginUser(request.payload);
        return h.response({ success: true, message: 'Login successful', user, token }).code(200);
    } catch (err) {
        return h.response({ success: false, error: err.message }).code(400);
    }
};
