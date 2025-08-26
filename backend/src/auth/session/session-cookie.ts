import { ConfigService } from '@nestjs/config';
const ms = require('ms');

export const getSessionCookieOpts = (configService: ConfigService) => {
    const raw = configService.get<string>('SESSION_EXPIRES_IN') ?? '7d';
    const maxAge = ms(raw);
    if (typeof maxAge !== 'number') throw new Error(`Invalid session expiry: ${raw}`)
    const isProd = configService.get<string>('NODE_ENV') === 'production';

    return {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax' as const,
        path: '/',
        maxAge: maxAge,
    };
};