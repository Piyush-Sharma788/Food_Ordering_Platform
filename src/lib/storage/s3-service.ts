import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

export class S3Service {
  private client: S3Client | null = null;
  private bucket: string;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'us-east-1';
    this.bucket = process.env.AWS_S3_BUCKET || 'food-ordering-platform-uploads';

    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      this.client = new S3Client({
        region: this.region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });
    }
  }

  public isConfigured(): boolean {
    return Boolean(this.client && process.env.AWS_ACCESS_KEY_ID);
  }

  /**
   * Generates a pre-signed PUT URL for client-side direct upload to S3
   */
  public async getPresignedUploadUrl(
    contentType: string,
    fileExtension: string
  ): Promise<{ uploadUrl: string; fileKey: string; publicUrl: string }> {
    const safeExt = fileExtension.replace(/^\./, '').toLowerCase();
    const fileKey = `menu-items/${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${safeExt}`;

    if (!this.client) {
      // Return a simulated upload endpoint for local development
      return {
        uploadUrl: `/api/uploads?key=${encodeURIComponent(fileKey)}`,
        fileKey,
        publicUrl: `/uploads/${fileKey}`,
      };
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
      ContentType: contentType,
    });

    // 15-minute presigned URL
    const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: 900 });
    const publicUrl = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileKey}`;

    return { uploadUrl, fileKey, publicUrl };
  }

  /**
   * Upload buffer directly from server
   */
  public async uploadBuffer(
    buffer: Buffer,
    contentType: string,
    prefix: string = 'items'
  ): Promise<string> {
    const fileKey = `${prefix}/${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;

    if (!this.client) {
      // In local dev without S3, return data URI or simulated path
      return `data:${contentType};base64,${buffer.toString('base64')}`;
    }

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileKey,
        Body: buffer,
        ContentType: contentType,
      })
    );

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileKey}`;
  }
}

export const s3Service = new S3Service();
export default s3Service;

