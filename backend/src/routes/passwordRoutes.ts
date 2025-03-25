import * as passwordController from '../controllers/passwordController.js';
import { ServerRoute } from '@hapi/hapi'; // Import Hapi's type definitions

export const passwordRoutes: ServerRoute[] = [
    { method: 'POST', path: '/api/forgot-password', handler: passwordController.requestReset },
    { method: 'POST', path: '/api/reset-password/{token}', handler: passwordController.resetPassword }
];
