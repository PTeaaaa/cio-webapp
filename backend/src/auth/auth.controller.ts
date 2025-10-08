import { Get, Post, Body, Controller, HttpCode, HttpStatus, Req, Res, UnauthorizedException, ValidationPipe, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { getSessionCookieOpts } from './session/session-cookie';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) { }

    @Post('login')
    async login(@Body() dto: { username: string; password: string; rememberMe?: boolean }, @Res({ passthrough: true }) res: Response) {

        try {
            const rememberMe = dto.rememberMe !== false; // Default to true if not specified
            const result = await this.authService.login(dto.username, dto.password, res, rememberMe);

            // Set access token in secure HTTP-only cookie
            // If rememberMe is false, don't set maxAge to make it a session cookie
            const cookieOptions: any = {
                httpOnly: true,
                secure: this.configService.get('app.nodeEnv') === 'production',
                sameSite: 'strict',
                path: '/',
            };

            // Only set maxAge if rememberMe is true
            if (rememberMe) {
                cookieOptions.maxAge = 60 * 60 * 1000; // 1 hour (same as JWT expiration)
            }

            res.cookie('at', result.accessToken, cookieOptions);

            return {
                user: result.user,
                message: 'Login successful'
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.log('LOGIN: Login failed for username:', dto.username, '-', errorMessage);
            throw error;
        }
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {

        // Clear the access token cookie
        res.clearCookie('at', {
            httpOnly: true,
            secure: this.configService.get('app.nodeEnv') === 'production',
            sameSite: 'strict',
            path: '/',
        });

        // Clear the refresh token cookie
        res.clearCookie('rt', {
            httpOnly: true,
            secure: this.configService.get('app.nodeEnv') === 'production',
            sameSite: 'strict',
            path: '/',
        });

        // Also clear any legacy session cookie if it exists
        res.clearCookie('sid', getSessionCookieOpts(this.configService));

        return { ok: true };
    }

    @Get('session')
    @UseGuards(JwtGuard)
    async getSession(@Req() req: Request & { user: { id: string; username: string; role: string } }) {
        try {
            // The JWT guard has already validated the token and attached user info to req.user
            // Get fresh user data from database
            const user = await this.prisma.account.findUnique({
                where: { id: req.user.id },
                select: { id: true, username: true, role: true },
            });

            if (!user) {
                console.log('SESSION: User not found in database for ID:', req.user.id);
                throw new UnauthorizedException('User not found');
            }

            return { user };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.log('SESSION: Error retrieving session -', errorMessage);
            throw new UnauthorizedException('Session retrieval failed');
        }
    }

    @Post('refresh-token')
    async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const rt = req.cookies?.rt as string | undefined;
        if (!rt) {
            console.log('REFRESH: No refresh token cookie provided');
            throw new UnauthorizedException('No refresh token');
        }

        try {
            const result = await this.authService.refreshToken(rt);

            // Use the stored remember me preference from the database
            const cookieOptions: any = {
                httpOnly: true,
                secure: this.configService.get('app.nodeEnv') === 'production',
                sameSite: 'strict',
                path: '/',
            };

            // Only set maxAge if the original session had rememberMe = true
            if (result.rememberMe) {
                cookieOptions.maxAge = 60 * 60 * 1000; // 1 hour
            }

            res.cookie('at', result.accessToken, cookieOptions);

            return { message: 'Token refreshed successfully' };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.log('REFRESH: Refresh token failed -', errorMessage);
            throw error;
        }
    }

    @Post('oauth/callback')
    async oauthCallback(@Body() dto: { code: string }, @Res({ passthrough: true }) res: Response) {
        try {
            const result = await this.authService.handleOAuthCallback(dto.code, res);

            // Set access token in secure HTTP-only cookie (same as regular login)
            const cookieOptions = {
                httpOnly: true,
                secure: this.configService.get('app.nodeEnv') === 'production',
                sameSite: 'strict' as const,
                path: '/',
                maxAge: 60 * 60 * 1000, // 1 hour (same as JWT expiration)
            };

            res.cookie('at', result.accessToken, cookieOptions);

            return {
                user: result.user,
                message: 'OAuth login successful'
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.log('OAUTH: OAuth callback failed -', errorMessage);
            throw error;
        }
    }



}