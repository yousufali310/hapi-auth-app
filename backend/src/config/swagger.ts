import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';

const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
        title: 'API Documentation',
        version: '1.0.0',
    },
    securityDefinitions: {
        BearerAuth: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            description: 'Enter your Bearer token in the format: Bearer <token>',
        },
    },
    security: [{ BearerAuth: [] }],
};

const swaggerPlugins = [
    Inert,
    Vision,
    {
        plugin: HapiSwagger,
        options: swaggerOptions,
    },
];

export default swaggerPlugins;
