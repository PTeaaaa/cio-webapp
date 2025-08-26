import { Injectable, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { MinioService } from '../minio/minio.service';
import { PrismaService } from '../prisma/prisma.service'; // นำเข้า PrismaService

@Injectable()
export class UploadService {
    constructor(
        private readonly minioService: MinioService,
        private readonly prisma: PrismaService, // Inject PrismaService
    ) { }

    /**
   * อัปโหลดรูปภาพและบันทึก URL ลงในฐานข้อมูล
   * @param file ไฟล์รูปภาพที่อัปโหลด
   * @param entityId ID ของ entity ที่เกี่ยวข้อง (เช่น personId, productId)
   * @param entityType ประเภทของ entity (เช่น 'person', 'product')
   * @returns URL ของรูปภาพที่อัปโหลด
   */

    async uploadPersonImage(file: Express.Multer.File, personId: string): Promise<string> {
        if (!file) {
            throw new BadRequestException('No file provided for upload.');
        }

        try {
            // 1. อัปโหลดไฟล์ไปยัง MinIO
            const imageUrl = await this.minioService.uploadFile(file);

            // 2. บันทึก URL ของรูปภาพลงในฐานข้อมูลสำหรับ Person โดยใช้ Prisma
            const updatedPerson = await this.prisma.person.update({
                where: { id: personId },
                data: { imageUrl },
            });

            if (!updatedPerson) {
                throw new NotFoundException(`Person with ID "${personId}" not found.`);
            }

            return imageUrl; // คืนค่า URL ของรูปภาพที่อัปโหลด
        }
        catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            // Log error และ throw InternalServerErrorException
            throw new InternalServerErrorException(`Failed to upload and save image: ${errorMessage}`);
        }
    }
}
