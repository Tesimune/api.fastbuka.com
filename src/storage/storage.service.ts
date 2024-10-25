import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuid } from 'uuid';

@Injectable()
export class StorageService {
  private s3: S3Client;
  private bucketName: string = process.env.AWS_S3_BUCKET_NAME;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async create(token: string, file: Express.Multer.File): Promise<{}> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuid()}.${fileExtension}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await this.s3.send(command);

    return {
      status: 200,
      success: true,
      message: 'File uploaded successfully',
      data: {
        path: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
      },
    }
  }

  async findAll(token: string) {
    return `This action returns all storage`;
  }

  async findOne(token: string, uuid: string) {
    return `This action returns a #${uuid} storage`;
  }

  async update(token: string, uuid: string, file: Express.Multer.File): Promise<{}> {
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuid}.${fileExtension}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);
    await this.s3.send(command);

    return {
      status: 200,
      success: true,
      message: 'File uploaded successfully',
      data: {
        path: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
      },
    }
  }

  async remove(token: string, uuid: string) {
    return `This action removes a #${uuid} storage`;
  }
}
