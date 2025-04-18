import { ServerRoute } from '@hapi/hapi';
import { fileController } from '../controllers/fileController.js';
import { authMiddleware } from '../middleware/adminMiddleware.js'; 
import Joi from 'joi';
import { emit } from 'process';


const fileRoutes: ServerRoute[] = [
  {
    method: 'POST',
    path: '/api/files/upload',
    handler: fileController.uploadFile,
    options: {
      tags: ['api', 'Files'],
      description: 'Upload a file',
      notes: 'Uploads a file to the server and returns the file URL.',
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data', 
        multipart: true
      },
      validate: {
        payload: Joi.object({
          file: Joi.any()
            .meta({ swaggerType: 'file' }) 
            .description('File to be uploaded')
            .required(),
            email: Joi.string()
        .email()
          .optional()
          .description('Optional email'),
        }).unknown(true) 
      },
      response: {
        schema: Joi.object({
          success: Joi.boolean().example(true),
          fileId: Joi.string().example('index.html'),
          url: Joi.string().uri().example('https://s3-bucket.com/index.html'),
        }).label('FileUploadResponse')
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form', 
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/api/files',
    handler: fileController.listFiles,
    options: {
      tags: ['api', 'Files'],
      description: 'List all files from S3 bucket',
      notes: 'Returns a list of files with metadata from the S3 bucket.',
      pre: [{ method: authMiddleware }],
      response: {
        schema: Joi.object({
          files: Joi.array()
            .items(
              Joi.object({
                fileId: Joi.string()
                  .required()
                  .example('bca-5-sem-numerical-and-statistical-methods-bcad501d-2023 (1).pdf')
                  .description('Unique identifier of the file'),

                size: Joi.number()
                  .required()
                  .example(80648)
                  .description('Size of the file in bytes'),

                lastModified: Joi.date()
                  .iso()
                  .required()
                  .example('2025-03-28T08:55:12.000Z')
                  .description('Last modified timestamp'),

                url: Joi.string()
                  .uri()
                  .required()
                  .example('https://hapi-js-bucket.s3.ap-south-1.amazonaws.com/sample.pdf?X-Amz-Signature=example')
                  .description('Signed URL to access the file')
              })
            )
            .required() // array is always returned — can be empty []
        }).label('FileListResponse')
      }

    }
  },
  {
    method: 'POST',
    path: '/api/files/{fileId}/download',
    handler: fileController.getDownloadUrl,
    options: {
      tags: ['api', 'Files'], 
      description: 'Get a signed URL for file download',
      notes: 'Returns a pre-signed URL to securely download the file from S3.',
      pre: [{ method: authMiddleware }], 
      validate: {
        params: Joi.object({
          fileId: Joi.string()
            .required()
            .example('sample-file.pdf')
            .description('Unique file identifier (filename)'),
        }),
      },
      response: {
        schema: Joi.object({
          url: Joi.string()
            .uri()
            .required()
            .example('https://example.com/download/sample-file.pdf?token=abcd1234')
            .description('Pre-signed URL to download the file')
        }).label('FileDownloadResponse')
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/files/{fileId}',
    handler: fileController.deleteFile,
    options: {
      tags: ['api', 'Files'],
      description: 'Delete a file',
      notes: 'Deletes a file from the system based on the fileId.',
      pre: [{ method: authMiddleware }], 
      validate: {
        params: Joi.object({
          fileId: Joi.string()
            .required()
            .example('sample-file.pdf')
            .description('Unique file identifier (filename)'),
        }),
      },
      response: {
        schema: Joi.object({
          success: Joi.boolean()
            .example(true)
            .description('Indicates if the file was deleted successfully'),
          message: Joi.string()
            .example('File deleted successfully')
            .description('Response message indicating the result'),
        }).label('FileDeleteResponse')
      }
    }
  }
];

export default fileRoutes;
