import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { jwtVerify } from 'jose';
import type { Request } from 'express';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('JWT_GUARD: No authorization header provided');
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
        console.log('JWT_GUARD: User not found in database for ID:', payload.sub);
        throw new UnauthorizedException('User not found');
      }
      
      // Attach user to request object
      (req as any).user = user;
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log('JWT_GUARD: JWT verification failed -', errorMessage);
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }
}
