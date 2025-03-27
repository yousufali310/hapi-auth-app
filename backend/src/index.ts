import Hapi from '@hapi/hapi';
import { authRoutes } from './routes/authRoutes.js';
import { passwordRoutes } from './routes/passwordRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import swaggerPlugins from './config/swagger.js'



const server = Hapi.server({
    port: process.env.PORT || 8000,
    host: 'localhost',
    routes: {
        cors: {
            origin: ['*'],
            headers: ['Accept', 'Content-Type', 'Authorization'],
            credentials: true
        },
    }
});


const registerPlugins = async () => {
    await server.register(swaggerPlugins);
}

server.route([...authRoutes, ...passwordRoutes, ...fileRoutes]);

const start = async () => {
    await registerPlugins(); 
    await server.start();
    console.log(`Server running at ${server.info.uri}`);
};

start().catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
});