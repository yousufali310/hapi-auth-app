import jwt from 'jsonwebtoken';
import { Request, ResponseToolkit, Lifecycle } from '@hapi/hapi';
import dotenv from 'dotenv';

dotenv.config();

const { TokenExpiredError, JsonWebTokenError } = jwt;

export const adminMiddleware: Lifecycle.Method = async (request: Request, h: ResponseToolkit) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return h.response({ error: 'Unauthorized: Invalid or missing token' }).code(401).takeover();
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

        if (decoded.role !== 'admin') {
            return h.response({ error: 'Access denied: Admin role required' }).code(403).takeover();
        }
        console.log(decoded);
        return h.continue;
    } catch (err) {
        const errorMsg = err instanceof TokenExpiredError 
            ? 'Token expired' 
            : err instanceof JsonWebTokenError 
            ? 'Invalid token' 
            : 'Error verifying token';

        return h.response({ error: `Unauthorized: ${errorMsg}` }).code(401).takeover();
    }
};
