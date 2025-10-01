import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { getSessionCookieOpts } from './session/session-cookie';
import { SignJWT } from 'jose';

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
    async signup(username: string, password: string, role: string, assignPlace: string[]) {
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

            // Create account with assigned places in a transaction
            const result = await this.prisma.$transaction(async (prisma) => {
                // Create the account
                const account = await prisma.account.create({
                    data: {
                        username: username.trim(),
                        password: hashedPassword,
                        role,
                    },
                });

                // Create account-place relationships if assignPlace is provided
                if (assignPlace && assignPlace.length > 0) {
                    // Validate that all place IDs exist
                    const existingPlaces = await prisma.place.findMany({
                        where: {
                            id: { in: assignPlace }
                        }
                    });

                    if (existingPlaces.length !== assignPlace.length) {
                        throw new BadRequestException('One or more place IDs are invalid');
                    }

                    // Create account-place relationships
                    await prisma.accountPlace.createMany({
                        data: assignPlace.map(placeId => ({
                            accountId: account.id,
                            placeId: placeId
                        })),
                        skipDuplicates: true
                    });
                }

                return account;
            });

            // Return user without password
            const { password: _, ...accountResult } = result;
            return accountResult;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Failed to create account');
        }
    }

    // You will need methods to generate tokens
    private async createAccessToken(user: { id: string, username: string, role: string }): Promise<string> {

        const secret = new TextEncoder().encode(this.configService.get<string>('jwt.secretKey'));
        const expires = this.configService.get<string>('jwt.accessExpirationTime');
        const token = await new SignJWT({ role: user.role, username: user.username })
            .setProtectedHeader({ alg: 'HS256' })
            .setSubject(user.id)
            .setIssuedAt()
            .setExpirationTime(expires!)
            .sign(secret);

        return token;
    }

    private async createRefreshToken(userId: string, res: Response, rememberMe: boolean = true): Promise<string> {

        const maxAge = this.configService.get<number>('jwt.refreshCookieMaxAge');
        const refreshToken = randomBytes(32).toString('base64url');
        const hashedToken = await bcrypt.hash(refreshToken, 12);
        const expires = new Date(Date.now() + maxAge!);

        // Store the HASHED refresh token in the database AND update session preference
        await this.prisma.account.update({
            where: { id: userId },
            data: {
                refreshToken: hashedToken,
                refreshTokenExpiresAt: expires,
                rememberMeSession: rememberMe  // Store session preference
            },
        });

        // Set the RAW refresh token in a secure cookie
        // If rememberMe is false, don't set maxAge to make it a session cookie
        const cookieOptions = getSessionCookieOpts(this.configService);
        if (!rememberMe) {
            // Remove maxAge to make it a session cookie
            const { maxAge, ...sessionCookieOptions } = cookieOptions;
            res.cookie('rt', refreshToken, sessionCookieOptions);
        } else {
            res.cookie('rt', refreshToken, cookieOptions);
        }

        return refreshToken;
    }

    async refreshToken(oldRefreshToken: string) {

        // Find user by matching the hashed refresh token
        const accounts = await this.prisma.account.findMany({
            where: {
                refreshToken: { not: null },
                refreshTokenExpiresAt: { gt: new Date() }
            }
        });

        const account = accounts.find(acc => acc.refreshToken && bcrypt.compareSync(oldRefreshToken, acc.refreshToken));

        if (!account) {
            console.log('AUTH_SERVICE: Invalid or expired refresh token provided');
            throw new UnauthorizedException('Invalid or expired refresh token.');
        }

        // Issue a new access token
        const newAccessToken = await this.createAccessToken(account);

        // Return the access token AND the stored session preference
        return {
            accessToken: newAccessToken,
            rememberMe: account.rememberMeSession ?? account.rememberMe  // Use session preference, fallback to default
        };
    }

    async login(username: string, password: string, res: Response, rememberMe: boolean = true) {

        const account = await this.prisma.account.findUnique({
            where: { username },
        });

        if (!account || !(await bcrypt.compare(password, account.password))) {
            console.log('AUTH_SERVICE: Invalid credentials for username:', username);
            throw new UnauthorizedException('Invalid credentials.');
        }

        // Use the provided rememberMe (from checkbox) or fallback to user's default preference
        const sessionRememberMe = rememberMe ?? account.rememberMe;

        // Update last login and session preference
        await this.prisma.account.update({
            where: { id: account.id },
            data: {
                lastLoginAt: new Date(),
                rememberMeSession: sessionRememberMe,  // Store this session's choice
            }
        });

        // Create both tokens using the session preference
        const accessToken = await this.createAccessToken(account);
        await this.createRefreshToken(account.id, res, sessionRememberMe);

        const { password: _, ...userWithoutPassword } = account;

        // Return the user data AND the short-lived access token
        return { user: userWithoutPassword, accessToken };
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
                rememberMeSession: null,  // Clear session preference on logout
            },
        });
        return true;
    }

    // Method to update user's default remember me preference (for settings page)
    async updateRememberMePreference(userId: string, rememberMe: boolean): Promise<void> {
        await this.prisma.account.update({
            where: { id: userId },
            data: { rememberMe }
        });
    }

    // ใน auth.service.ts
    async handleOAuthCallback(code: string, res: Response) {
        // --- ส่วนที่จำลองขึ้นมา ---
        // ปกติจะยิง API ไปแลก Token แต่ตอนนี้เราแค่แกล้งทำ
        const mockAccessToken = this.getMockAccessToken(code);

        // ปกติจะยิง API ไปขอข้อมูล User แต่ตอนนี้เราแค่แกล้งทำ
        const mockUserInfo = this.getMockUserInfo(mockAccessToken);
        // --- จบส่วนจำลอง ---

        // --- ส่วน Logic จริงที่คุณเขียนได้เลย ---
        // 1. ค้นหา User ใน DB ของคุณด้วย cardId ที่ได้จาก Mock Data
        let user = await this.prisma.account.findUnique({
            where: { cardId: mockUserInfo.cardId },
        });

        // 2. ถ้าไม่เจอก็สร้างใหม่
        if (!user) {
            user = await this.prisma.account.create({
                data: {
                    cardId: mockUserInfo.cardId,
                    email: mockUserInfo.email,
                    username: mockUserInfo.cardId, // Use cardId as username for OAuth users
                    password: '', // OAuth users don't have passwords, use empty string or hash
                    role: mockUserInfo.role, // Use role from mock user info
                    name: mockUserInfo.name,
                },
            });
        }

        // 3. สร้าง JWT Token ของแอปคุณเอง (ใช้ฟังก์ชันเดิมได้เลย)
        const appAccessToken = await this.createAccessToken(user);
        await this.createRefreshToken(user.id, res, true); // Create refresh token with remember me enabled

        // Return user data and access token (refresh token is set in cookie)
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, accessToken: appAccessToken };
    }

    // ฟังก์ชันจำลองที่คุณสร้างขึ้นมาเองเพื่อการทดสอบ
    private getMockAccessToken(code: string): string {
        if (code === 'valid_mock_code') return 'mock_access_token_123';
        throw new Error('Invalid Mock Code');
    }

    private getMockUserInfo(token: string) {
        if (token === 'mock_access_token_123') {
            return {
                cardId: '99999',
                email: 'test.user@company.com',
                name: 'Test User',
                role: 'admin',
            };
        }
        throw new Error('Invalid Mock Access Token');
    }
}

