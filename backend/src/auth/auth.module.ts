import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
    ],
    exports: [], // No need to export anything for session-based auth
})
export class AuthModule { }
