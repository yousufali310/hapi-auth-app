import * as authController from '../controllers/authController.js';

export default [
    { method: 'POST', path: '/api/register', handler: authController.register },
    { method: 'POST', path: '/api/login', handler: authController.login }
];
