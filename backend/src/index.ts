import Hapi from '@hapi/hapi';
import { authRoutes } from './routes/authRoutes.js';
import { passwordRoutes } from './routes/passwordRoutes.js';



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

server.route([...authRoutes,...passwordRoutes]);



const start = async () => {
    await server.start();
    console.log(`Server running at ${server.info.uri}`);
};

start();
