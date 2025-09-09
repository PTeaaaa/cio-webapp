import { Module } from '@nestjs/common';
import { PeopleController } from './people.controller';
import { PeopleService } from './people.service';
import { PrismaModule } from "@/prisma/prisma.module";
import { MinioModule } from "@/minio/minio.module";

@Module({
  imports: [PrismaModule, MinioModule],
  controllers: [PeopleController],
  providers: [PeopleService]
})
export class PeopleModule {}
