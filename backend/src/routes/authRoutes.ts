import {login, register} from '../controllers/authController.js'
import { ServerRoute } from '@hapi/hapi';

export const authRoutes: ServerRoute[] = [
    { 
        method: 'POST', 
        path: '/api/login', 
        handler: login
    },
    {
        method:'POST',
        path: '/api/register',
        handler: register
    }
];