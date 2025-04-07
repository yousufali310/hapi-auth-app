import { Request, ResponseToolkit } from '@hapi/hapi';
import * as passwordService from '../services/passwordService.js';

interface RequestResetPayload {
    email: string;
}

interface ResetPasswordPayload {
    password: string;
}

export const requestReset = async (request: Request, h: ResponseToolkit) => {
    try {
        const { email } = request.payload as RequestResetPayload;
        const response = await passwordService.requestPasswordReset(email);
        return h.response(response).code(200);
    } catch (err) {
        return h.response({ error: (err as Error).message }).code(400);
    }
};

export const resetPassword = async (request: Request, h: ResponseToolkit) => {
    try {
        const { password } = request.payload as ResetPasswordPayload;
        console.log(password);
        
        const response = await passwordService.resetPassword(request.params.token, password);
        return h.response(response).code(200);
    } catch (err) {
        return h.response({ error: (err as Error).message }).code(400);
    }
};

