import * as passwordService from '../services/passwordService.js';

export const requestReset = async (request, h) => {
    try {
        const response = await passwordService.requestPasswordReset(request.payload.email);
        return h.response(response).code(200);
    } catch (err) {
        return h.response({ error: err.message }).code(400);
    }
};

export const resetPassword = async (request, h) => {
    try {
        const response = await passwordService.resetPassword(request.params.token, request.payload.password);
        return h.response(response).code(200);
    } catch (err) {
        return h.response({ error: err.message }).code(400);
    }
};
