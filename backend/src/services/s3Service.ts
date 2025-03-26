import { s3, BUCKET_NAME } from '../config/s3.js';
import { PutObjectCommand, GetObjectCommand, ListObjectsV2Command ,DeleteObjectCommand} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3Service {
  static async uploadFile(fileId: string, fileData: Buffer, contentType: string) {
    
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileId,
      Body: fileData,
      ContentType: contentType,
    }));
  }

  static async generateDownloadUrl(fileId: string) {
    return getSignedUrl(s3, new GetObjectCommand({ Bucket: BUCKET_NAME, Key: fileId }), { expiresIn: 3600 });
  }

  static async listFiles() {
    
     const response = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET_NAME }));
     const { Contents } = response;
    console.log(response);
    
    return await Promise.all(
      Contents?.map(async file => ({
        fileId: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
        url: await this.generateDownloadUrl(file.Key!)
      })) || []
    );
  }

    static async deleteFile(fileId: string) {
    await s3.send(new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileId,
    }));
  }
}
