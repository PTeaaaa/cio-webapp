import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { getSessionCookieOpts } from './session/session-cookie';

export interface SessionUser {
    id: string;
    username: string;
    role: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) { }

    // Enhanced signup method with validation and error handling
    async signup(username: string, password: string, role: string) {
        // Validate input
        if (!username || username.trim().length < 3) {
            throw new BadRequestException('Username must be at least 3 characters long');
        }

        if (!password || password.length < 6) {
            throw new BadRequestException('Password must be at least 6 characters long');
        }

        if (!['admin', 'user', 'moderator'].includes(role)) {
            throw new BadRequestException('Invalid role. Must be admin, user, or moderator');
        }

        // Check if username already exists
        const existingAccount = await this.prisma.account.findUnique({
            where: { username: username.trim() },
        });

        if (existingAccount) {
            throw new ConflictException('Username already exists');
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const account = await this.prisma.account.create({
                data: {
                    username: username.trim(),
                    password: hashedPassword,
                    role,
                },
            });

            // Return user without password
            const { password: _, ...result } = account;
            return result;
        } catch (error) {
            throw new BadRequestException('Failed to create account');
        }
    }

    async login(username: string, password: string, res: Response) {
        const account = await this.prisma.account.findUnique({
            where: { username },
        });

        if (!account || !(await bcrypt.compare(password, account.password))) {
            throw new UnauthorizedException('Invalid credentials. Please check username and password.');
        }

        // Issue session instead of JWT tokens
        await this.issueSession(account.id, res);

        const { password: _, ...userWithoutPassword } = account;
        return userWithoutPassword;
    }

    async logout(userId: string): Promise<boolean> {
        await this.prisma.account.updateMany({
            where: {
                id: userId,
                sessionId: {
                    not: null,
                },
            },
            data: {
                sessionId: null,
            },
        });
        return true;
    }

    async verifyUser(username: string, password: string) {

        const user = await this.prisma.account.findFirst({
            where: { username: username }
        });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        // ถ้าคุณยังไม่ใช้ bcrypt ให้เปลี่ยนมาเทียบ plain หรือ argon2
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) throw new UnauthorizedException('Invalid credentials');

        return user;
    }

    // สร้าง session ID แบบสุ่ม
    async issueSession(userId: string, res: Response) {
        
        const sid = randomBytes(32).toString('base64url');
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await this.prisma.account.update({
            where: { id: userId },
            data: {
                sessionId: sid,
                sessionExpiredAt: expires, // ถ้าไม่ใช้ expiry ฝั่ง server ให้ลบบรรทัดนี้
                sessionRevokedAt: null,
            },
        });

        res.cookie('sid', sid, getSessionCookieOpts(this.configService));
    }

    async revokeBySid(sid: string) {
        await this.prisma.account.updateMany({
            where: { sessionId: sid },
            data: {
                sessionId: null,
                sessionRevokedAt: new Date(),
                sessionExpiredAt: null
            },
        });
    }
}
