import { Controller, Post, UseInterceptors, UploadedFile, Param, ParseUUIDPipe, BadRequestException, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post(':entityId')
    @UseInterceptors(FileInterceptor('image')) // 'image' คือชื่อ field ใน FormData ที่จะใช้ส่งไฟล์
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Param('entityId', ParseUUIDPipe) entityId: string, // ตรวจสอบว่าเป็น UUID ที่ถูกต้อง
    ) {
        if (!file) {
            throw new BadRequestException('No file provided.');
        }

        const imageUrl = await this.uploadService.uploadPersonImage(file, entityId);
        
        return {
            message: 'Image uploaded successfully',
            imageUrl: imageUrl,
        };
    }
}
