import * as passwordController from '../controllers/passwordController.js';

export default [
    { method: 'POST', path: '/api/forgot-password', handler: passwordController.requestReset },
    { method: 'POST', path: '/api/reset-password/{token}', handler: passwordController.resetPassword }
];
