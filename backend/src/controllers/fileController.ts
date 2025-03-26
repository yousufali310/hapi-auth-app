import { Request, ResponseToolkit } from '@hapi/hapi';
import { S3Service } from '../services/s3Service.js';

export const fileController = {
  uploadFile: async (request: Request, h: ResponseToolkit) => {
    try {
      const { file } = request.payload as any;
      const fileId = file.hapi.filename;
      console.log(fileId);
      
      
      await S3Service.uploadFile(fileId, file._data, file.hapi.headers['content-type']);

      return h.response({
        success: true,
        fileId,
        url: await S3Service.generateDownloadUrl(fileId),
      }).code(201);
    } catch (error) {
      console.error("Upload File Error:", error);
      return h.response({ success: false, message: 'File upload failed' }).code(500);
    }
  },

  listFiles: async (_request: Request, h: ResponseToolkit) => {
    try {
      const files = await S3Service.listFiles();
      return h.response({ files }).code(200);
    } catch (error) {
      console.error("List Files Error:", error);
      return h.response({ success: false, message: 'Failed to list files' }).code(500);
    }
  },

  getDownloadUrl: async (request: Request, h: ResponseToolkit) => {
    try {
      const { fileId } = request.params;
      const url = await S3Service.generateDownloadUrl(fileId);
      return h.response({ url }).code(200);
    } catch (error) {
      console.error("Get Download URL Error:", error);
      return h.response({ success: false, message: 'Failed to get download URL' }).code(500);
    }
  },
   deleteFile: async (request: Request, h: ResponseToolkit) => {
    try {
      const { fileId } = request.params;
      
      await S3Service.deleteFile(fileId);

      return h.response({ success: true, message: 'File deleted successfully' }).code(200);
    } catch (error) {
      console.error("Delete File Error:", error);
      return h.response({ success: false, message: 'Failed to delete file' }).code(500);
    }
  },
};
