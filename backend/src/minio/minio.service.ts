import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MinioService {
    private readonly minioClient: Minio.Client;
    private readonly bucketName: string;
    private readonly logger = new Logger(MinioService.name);

    constructor(private readonly configService: ConfigService) {
        const endPoint = this.configService.getOrThrow<string>('minio.endpoint');
        const port = this.configService.getOrThrow<number>('minio.port');
        const accessKey = this.configService.getOrThrow<string>('minio.accessKey');
        const secretKey = this.configService.getOrThrow<string>('minio.secretKey');
        const useSSL = this.configService.get<boolean>('minio.useSsl'); // Already converted to boolean in config
        this.bucketName = this.configService.getOrThrow<string>('minio.bucketName');

        // ตรวจสอบว่าค่าที่จำเป็นมีอยู่ครบถ้วนหรือไม่
        if (!endPoint || !port || !accessKey || !secretKey || !this.bucketName) {
            this.logger.error('MinIO environment variables are not fully configured.');
            throw new InternalServerErrorException('MinIO configuration error.');
        }

        // สร้าง MinIO Client Instance
        this.minioClient = new Minio.Client({
            endPoint: endPoint,
            port: port,
            useSSL: useSSL,
            accessKey: accessKey,
            secretKey: secretKey,
        });

        // ตรวจสอบว่า Bucket มีอยู่หรือไม่ ถ้าไม่มีให้สร้างขึ้นมา
        this.ensureBucketExists();
    }

    private async ensureBucketExists() {
        try {
            const exists = await this.minioClient.bucketExists(this.bucketName);
            if (!exists) {
                await this.minioClient.makeBucket(this.bucketName, 'us-east-1'); // 'us-east-1' เป็น region default
                this.logger.log(`Bucket '${this.bucketName}' created successfully.`);
            }
            else {
                this.logger.log(`Bucket '${this.bucketName}' already exist.`);
            }
        }
        catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error checking or creating bucket '${this.bucketName}':`, errorMessage);
            throw new InternalServerErrorException(`Failed to initialize MinIO bucket: ${errorMessage}`);
        }
    }

    /**
   * อัปโหลดไฟล์ไปยัง MinIO
   * @param file ไฟล์ที่อัปโหลด (จาก Multer)
   * @returns URL ของไฟล์ที่อัปโหลด
   */
    async uploadFile(file: Express.Multer.File): Promise<string> {
        if (!file) {
            throw new Error('No file provided for upload.');
        }

        // สร้างชื่อไฟล์ที่ไม่ซ้ำกันโดยใช้ UUID และรักษานามสกุลไฟล์เดิม
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;
        const metaData = {
            'Content-Type': file.mimetype,
        };

        try {
            // อัปโหลดไฟล์ไปยัง MinIO
            await this.minioClient.putObject(this.bucketName, fileName, file.buffer, file.buffer.length, metaData);
            this.logger.log(`File '${fileName}' uploaded successfully to bucket '${this.bucketName}'.`);

            // สร้าง URL สำหรับเข้าถึงไฟล์
            // สำหรับ MinIO ที่รัน Local, URL จะเป็น http://localhost:PORT/BUCKET_NAME/FILE_NAME
            const minioEndpoint = this.configService.get<string>('minio.endpoint');
            const minioPort = this.configService.get<number>('minio.port');
            const protocol = this.configService.get<boolean>('minio.useSsl') ? 'https' : 'http';

            return `${protocol}://${minioEndpoint}:${minioPort}/${this.bucketName}/${fileName}`;

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`Error uploading file to MinIO:`, errorMessage);
            throw new InternalServerErrorException(`Failed to upload file: ${errorMessage}`);
        }
    }

}
