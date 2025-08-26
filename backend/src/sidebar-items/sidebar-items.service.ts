import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SessionUser } from '@/auth/auth.service';

@Injectable()
export class SidebarItemsService {
    constructor(private readonly prisma: PrismaService) {}

    async getSidebarItems(user: SessionUser): Promise<any[]> {
        if (user.role === 'admin') {
            return this.prisma.place.findMany();
        }

        if (user.role === 'user') {
            return this.prisma.place.findMany({
                where: {
                    assignedAccounts: {
                        some: {
                            accountId: user.id, // Changed from userId to id
                        },
                    },
                },
            });
        }

        return [];
    }
}
