import { s3, BUCKET_NAME } from '../config/s3.js';
import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3Service {
  
  static async uploadFile(fileId: string, fileData: Buffer,email:string, contentType: string) {
    const partSize = 5 * 1024 * 1024; 
    let partNumber = 1;
    const parts: { ETag: string; PartNumber: number }[] = [];
  
    const s3Key = `${email}/${fileId}`;
    const createUpload = await s3.send(
      new CreateMultipartUploadCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        ContentType: contentType,
      })
    );

    const uploadId = createUpload.UploadId;
    if (!uploadId) throw new Error('UploadId is undefined');

    for (let start = 0; start < fileData.length; start += partSize) {
      const end = Math.min(start + partSize, fileData.length);
      const partBuffer = fileData.slice(start, end);

      const uploadPartResponse = await s3.send(
        new UploadPartCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
          PartNumber: partNumber,
          UploadId: uploadId,
          Body: partBuffer,
        })
      );

      parts.push({ ETag: uploadPartResponse.ETag!, PartNumber: partNumber });
      partNumber++;
    }

    await s3.send(
      new CompleteMultipartUploadCommand({
        Bucket: BUCKET_NAME,
        Key: s3Key,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts },
      })
    );
  }

  
  static async generateDownloadUrl(fileId: string) {
    return getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileId,
      }),
      { expiresIn: 3600 }
    );
  }

  
static async listFiles(email: any) {
  console.log("Listing files for:", email);

  const response = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET_NAME })
  );

  if (!response.Contents || response.Contents.length === 0) {
    return [];
  }

  return Promise.all(
    response.Contents
      .filter((file) => file.Key?.startsWith(`${email}/`)) 
      .map(async (file) => {
        const fileName = file.Key!.replace(`${email}/`, ''); 
        return {
          fileId: fileName,
          size: file.Size,
          lastModified: file.LastModified,
          url: await this.generateDownloadUrl(file.Key!), 
        };
      })
  );
}


  
  static async deleteFile(fileId: string,email: any) {
    console.log("Deleting file:", fileId);
    console.log(email);
    
    const fileKey = `${email}/${fileId}`;
    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
      })
    );
  }
}
