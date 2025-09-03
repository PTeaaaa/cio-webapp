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

        const secret = new TextEncoder().encode(this.configService.get('JWT_SECRET_KEY'));
        const token = await new SignJWT({ role: user.role, username: user.username })
            .setProtectedHeader({ alg: 'HS256' })
            .setSubject(user.id)
            .setIssuedAt()
            .setExpirationTime('1h') // Short life!
            .sign(secret);

        return token;
    }

    private async createRefreshToken(userId: string, res: Response): Promise<string> {

        const refreshToken = randomBytes(32).toString('base64url');
        const hashedToken = await bcrypt.hash(refreshToken, 12);
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        // Store the HASHED refresh token in the database
        await this.prisma.account.update({
            where: { id: userId },
            data: { refreshToken: hashedToken, refreshTokenExpiresAt: expires },
        });

        // Set the RAW refresh token in a secure cookie
        res.cookie('rt', refreshToken, getSessionCookieOpts(this.configService));

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

        const account = accounts.find(acc => bcrypt.compareSync(oldRefreshToken, acc.refreshToken!));

        if (!account) {
            console.log('AUTH_SERVICE: Invalid or expired refresh token provided');
            throw new UnauthorizedException('Invalid or expired refresh token.');
        }

        // Issue a new access token
        const newAccessToken = await this.createAccessToken(account);

        return { accessToken: newAccessToken };
    }

    async login(username: string, password: string, res: Response) {

        const account = await this.prisma.account.findUnique({
            where: { username },
        });

        if (!account || !(await bcrypt.compare(password, account.password))) {
            console.log('AUTH_SERVICE: Invalid credentials for username:', username);
            throw new UnauthorizedException('Invalid credentials.');
        }

        // Create both tokens
        const accessToken = await this.createAccessToken(account);
        await this.createRefreshToken(account.id, res);

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
            },
        });
        return true;
    }
}
