import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    // Signup method, Just for demonstration purposes
    async signup(username: string, pass: string, role: string) {
        const hashedPassword = await bcrypt.hash(pass, 12);
        const account = await this.prisma.account.create({
            data: {
                username,
                password: hashedPassword,
                role,
            },
        });
        // We don't return the password hash
        const { password, ...result } = account;
        return result;
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
