import { login, register } from '../controllers/authController.js';
import { ServerRoute } from '@hapi/hapi';
import { adminMiddleware } from '../middleware/adminMiddleware.js';
import { getUsers } from '../controllers/adminController.js';

export const authRoutes: ServerRoute[] = [
    { 
        method: 'POST', 
        path: '/api/login', 
        handler: login
    },
    {
        method: 'POST',
        path: '/api/register',
        handler: register
    },
    {
        method: 'GET', 
        path: '/api/admin/users', 
        handler: getUsers, 
        options: { 
            pre: [{ method: adminMiddleware, assign: 'adminValidation' }] 
        }
    }
];
