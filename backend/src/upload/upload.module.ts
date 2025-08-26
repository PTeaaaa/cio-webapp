import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MinioModule } from '../minio/minio.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    MinioModule, 
    PrismaModule,
    MulterModule.register({
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB in bytes
        files: 1, // Maximum number of files
      },
      fileFilter: (req, file, callback) => {
        // Allow only image files
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          callback(null, true);
        } else {
          callback(new Error('Only image files are allowed!'), false);
        }
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
