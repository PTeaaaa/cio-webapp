import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { Request } from 'express';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<Request>();
    const sid = req.cookies?.sid as string | undefined;
    if (!sid) throw new UnauthorizedException();

    const user = await this.prisma.account.findFirst({
      where: {
        sessionId: sid,
        sessionRevokedAt: null,
        sessionExpiredAt: { gt: new Date() }, // ถ้าไม่ใช้ expiry ให้ลบบรรทัดนี้
      },
      select: { id: true, username: true, role: true },
    });

    if (!user) throw new UnauthorizedException();
    (req as any).user = user;
    return true;
  }
}