import { Get, Post, Body, Controller, HttpCode, HttpStatus, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { getSessionCookieOpts } from './session/session-cookie';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
    ) { }

    @Post('login')
    async login(@Body() dto: { username: string; password: string }, @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.login(dto.username, dto.password, res);
        return { user };
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const sid = req.cookies?.sid as string | undefined;
        if (sid) await this.authService.revokeBySid(sid);
        // ล้าง cookie
        res.clearCookie(
            'sid',
            getSessionCookieOpts(this.configService)
        );

        return { ok: true };
    }

    @Post('signup')
    async signup(@Body() authDto: AuthDto) {
        return this.authService.signup(authDto.username, authDto.password, 'user');
    }

    @Get('session')
    async getSession(@Req() req: Request) {
        const sid = req.cookies?.sid as string | undefined;
        if (!sid) throw new UnauthorizedException('No session cookie');


        const user = await this.prisma.account.findFirst({
            where: {
                sessionId: sid,
                sessionRevokedAt: null,
                sessionExpiredAt: { gt: new Date() },
            },
            select: { id: true, username: true, role: true },
        });


        if (!user) throw new UnauthorizedException('Session not found or expired');
        return { user };
    }
}