import { ServerRoute } from '@hapi/hapi';
import { fileController } from '../controllers/fileController.js';
import { authMiddleware } from '../middleware/adminMiddleware.js'; // Import Auth Middleware

const fileRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/files/upload',
    handler: fileController.uploadFile,
    options: {
     payload: {
        maxBytes: 10485760, 
        parse: true,
        multipart: true,
        output: 'stream'
      },
      pre: [{ method: authMiddleware }] 
    }
  },
  {
    method: 'GET',
    path: '/api/files',
    handler: fileController.listFiles,
    options: {
      pre: [{ method: authMiddleware }] 
    }
  },
  {
    method: 'GET',
    path: '/api/files/{fileId}/download',
    handler: fileController.getDownloadUrl,
    options: {
      pre: [{ method: authMiddleware }] 
    }
  },
  {
    method: 'DELETE',
    path: '/api/files/{fileId}',
    handler: fileController.deleteFile,
    options: {
      pre: [{ method: authMiddleware }] 
    }
  }
];

export default fileRoutes;
