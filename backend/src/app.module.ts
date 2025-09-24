import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SidebarItemsModule } from './sidebar-items/sidebar-items.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PeopleModule } from './people/people.module';
import { PlacesModule } from './places/places.module';
import { MinioModule } from './minio/minio.module';
import { UploadService } from './upload/upload.service';
import { UploadModule } from './upload/upload.module';
import { AccountsModule } from './accounts/accounts.module';
import { SearchModule } from './search/search.module';
import * as Joi from 'joi';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configuration,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3003),

        DATABASE_URL: Joi.string().required(),

        SESSION_EXPIRES_IN: Joi.string().pattern(/^\d+[smhd]$/).default("7d"),

        FRONTEND_URL_PUBLIC: Joi.string().uri().required(),
        FRONTEND_URL_ADMIN: Joi.string().uri().required(),

        COOKIE_SECURE: Joi.boolean().default(true),
        COOKIE_DOMAIN: Joi.string().optional(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    UsersModule,
    SidebarItemsModule,
    PrismaModule,
    AuthModule,
    PeopleModule,
    PlacesModule,
    MinioModule,
    UploadModule,
    AccountsModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService, UploadService],
})
export class AppModule { }
