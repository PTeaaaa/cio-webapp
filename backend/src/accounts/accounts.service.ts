import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AccountForm } from '@/types';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AccountsService {

    constructor(private readonly prisma: PrismaService) { }

    async findAllAccounts(page: number, limit: number) {
        try {
            const skip = (page - 1) * limit;

            const [accounts, total] = await this.prisma.$transaction([
                this.prisma.account.findMany({
                    orderBy: {
                        createdAt: 'asc',
                    },
                    skip: skip,
                    take: limit,
                }),
                this.prisma.account.count(), // Changed from person.count() to account.count()
            ]);

            return {
                data: accounts,
                meta: {
                    total,
                    page,
                    limit,
                    lastPage: Math.ceil(total / limit),
                }
            };

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new InternalServerErrorException(`Failed to fetch accounts: ${errorMessage}`); // Updated error message
        }
    }
}
