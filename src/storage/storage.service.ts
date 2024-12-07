import { HttpException, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ObjectCannedACL,
} from '@aws-sdk/client-s3';
import { DatabaseService } from 'src/database/database.service';
import { MiddlewareService } from 'src/middleware/middleware.service';
import { randomBytes } from 'crypto';

@Injectable()
export class StorageService {
  private s3: S3Client;
  private bucketname: string = process.env.AWS_S3_BUCKET_NAME;

  constructor(
    private readonly database: DatabaseService,
    private readonly middlewareService: MiddlewareService,
  ) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  private generateRandomToken(length: number): string {
    return randomBytes(length).toString('hex').slice(0, length);
  }

  public async bucket(
    token: string,
    use: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const storage = await this.storage(token, use, file);
    return storage.url;
  }

  async create(
    token: string,
    use: string,
    file: Express.Multer.File,
  ): Promise<{}> {
    const storage = await this.storage(token, use, file);

    return {
      status: 200,
      success: true,
      message: 'File uploaded successfully',
      data: {
        storage,
      },
    };
  }

  async update(
    token: string,
    use: string,
    file: Express.Multer.File,
  ): Promise<{}> {
    const storage = await this.storage(token, use, file);

    return {
      status: 200,
      success: true,
      message: 'File updated successfully',
      data: {
        storage,
      },
    };
  }

  private async storage(token: string, use: string, file: Express.Multer.File) {
    const user = await this.middlewareService.decodeToken(token);

    if (!file) {
      throw new HttpException(
        {
          status: 422,
          success: false,
          message: 'The image or file field is required',
        },
        422,
      );
    }

    const slug = this.generateRandomToken(45);
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    const fileuse = `${slug}.${fileExtension}`;

    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const isImage = allowedImageTypes.includes(file.mimetype);
    const isPdf = file.mimetype === 'application/pdf';
    const maxSizeInMB = 10;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    if (!isImage && !isPdf) {
      throw new HttpException(
        {
          status: 419,
          success: false,
          message: 'Only images and pdf files are allowed',
        },
        419,
      );
    } else if (file.size > maxSizeInBytes) {
      throw new HttpException(
        {
          status: 413,
          success: false,
          message: `File size must not exceed ${maxSizeInMB} MB.`,
        },
        413,
      );
    }

    const folderPath = isImage ? `storage/images/` : `storage/document/`;
    const filePath = `${folderPath}${fileuse}`;

    const existingFile = await this.database.storage.findUnique({
      where: {
        user_uuid_use: {
          user_uuid: user.uuid,
          use,
        },
      },
    });

    if (existingFile) {
      const deleteParams = {
        Bucket: this.bucketname,
        Key: existingFile.path,
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await this.s3.send(deleteCommand);
    }

    const uploadParams = {
      Bucket: this.bucketname,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: ObjectCannedACL.public_read,
    };

    try {
      const command = new PutObjectCommand(uploadParams);
      await this.s3.send(command);

      const fileUrl = `https://${this.bucketname}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`;

      await this.database.storage.upsert({
        where: {
          user_uuid_use: {
            user_uuid: user.uuid,
            use,
          },
        },
        update: {
          slug,
          user_uuid: user.uuid,
          use,
          base_url: `https://${this.bucketname}.s3.${process.env.AWS_REGION}.amazonaws.com`,
          path: filePath,
          type: file.mimetype,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        },
        create: {
          slug,
          user_uuid: user.uuid,
          use,
          base_url: `https://${this.bucketname}.s3.${process.env.AWS_REGION}.amazonaws.com`,
          path: filePath,
          type: file.mimetype,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        },
      });

      return {
        filePath,
        url: fileUrl,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 500,
          success: false,
          message: 'File upload failed',
          error: error.message,
        },
        500,
      );
    }
  }
}
