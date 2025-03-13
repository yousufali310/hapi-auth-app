import Hapi from '@hapi/hapi';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';
import passwordRoutes from './src/routes/passwordRoutes.js';

dotenv.config();

const server = Hapi.server({
    port: process.env.PORT || 8000,
    host: 'localhost',
    routes: {
        cors: {
            origin: ['*'], 
            headers: ['Accept', 'Content-Type', 'Authorization'],
            credentials: true 
        }
    }
});

server.route([...authRoutes, ...passwordRoutes]);

const start = async () => {
    await server.start();
    console.log(` Server running at ${server.info.uri}`);
};

start();
