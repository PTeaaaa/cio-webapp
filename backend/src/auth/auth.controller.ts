import { Get, Post, Body, Controller, HttpCode, HttpStatus, Req, Res, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { getSessionCookieOpts } from './session/session-cookie';
import { SignupDto } from './dto/signup.dto';
import { jwtVerify } from 'jose';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) { }

    @Post('login')
    async login(@Body() dto: { username: string; password: string }, @Res({ passthrough: true }) res: Response) {

        try {
            const result = await this.authService.login(dto.username, dto.password, res);

            return { 
                user: result.user,
                accessToken: result.accessToken 
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.log('LOGIN: Login failed for username:', dto.username, '-', errorMessage);
            throw error;
        }
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        // Clear the refresh token cookie
        res.clearCookie(
            'refreshToken',
            getSessionCookieOpts(this.configService)
        );

        // Also clear any legacy session cookie if it exists
        res.clearCookie(
            'sid',
            getSessionCookieOpts(this.configService)
        );

        return { ok: true };
    }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(@Body(ValidationPipe) signupDto: SignupDto) {
        const { username, password, role, assignPlace } = signupDto;
        const user = await this.authService.signup(username, password, role, assignPlace);

        return {
            message: 'Account created successfully',
            user,
        };
    }

    @Get('session')
    async getSession(@Req() req: Request) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('SESSION: No authorization header provided');
            throw new UnauthorizedException('No valid access token provided');
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        try {
            // Validate JWT token and extract user info
            const secret = new TextEncoder().encode(this.configService.get('JWT_SECRET_KEY'));
            const { payload } = await jwtVerify(token, secret);
            
            // Get user from database based on JWT subject (user ID)
            const user = await this.prisma.account.findUnique({
                where: { id: payload.sub },
                select: { id: true, username: true, role: true },
            });

            if (!user) {
                console.log('SESSION: User not found in database for ID:', payload.sub);
                throw new UnauthorizedException('User not found');
            }

            return { user };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            console.log('SESSION: JWT verification failed -', errorMessage);

            console.log('SESSION: Client should use refresh token to get new access token');

            throw new UnauthorizedException('Invalid or expired access token');
        }
    }

    @Post('refresh-token')
    async refreshToken(@Req() req: Request) {
        const refreshToken = req.cookies?.refreshToken as string | undefined;

        if (!refreshToken) {
            console.log('REFRESH: No refresh token cookie provided');
            throw new UnauthorizedException('No refresh token');
        }
        
        try {
            const result = await this.authService.refreshToken(refreshToken);

            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            console.log('REFRESH: Refresh token failed -', errorMessage);

            throw error;
        }
    }

}