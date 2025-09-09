import { ConfigService } from '@nestjs/config';
const ms = require('ms');

export const getSessionCookieOpts = (configService: ConfigService) => {
    const raw = configService.get<string>('jwt.sessionExpiresIn') ?? '7d';
    const maxAge = ms(raw);
    if (typeof maxAge !== 'number') throw new Error(`Invalid session expiry: ${raw}`)
    const isProd = configService.get<string>('app.nodeEnv') === 'production';

    return {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax' as const,
        path: '/',
        maxAge: maxAge,
    };
};

export const getSessionCookieOptsWithoutMaxAge = (configService: ConfigService) => {
    const isProd = configService.get<string>('app.nodeEnv') === 'production';

    return {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax' as const,
        path: '/',
    };
};