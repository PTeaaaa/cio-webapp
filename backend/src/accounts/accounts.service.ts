import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AccountForm } from '@/types';
import { PrismaService } from '@/prisma/prisma.service';

export interface UpdateAccountPayload {
    username?: string;
    role?: string;
    isActive?: boolean;
    assignedPlaces?: string[];
}

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
                    include: {
                        assignedPlaces: {
                            include: {
                                place: true
                            }
                        }
                    }
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

    async findAccountById(id: string) {
        try {
            const account = await this.prisma.account.findUnique({
                where: { id },
                include: {
                    assignedPlaces: {
                        include: {
                            place: true
                        }
                    }
                }
            });

            if (!account) {
                throw new NotFoundException(`Account with ID ${id} not found`);
            }

            return account;
        } catch (error: unknown) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new InternalServerErrorException(`Failed to fetch account: ${errorMessage}`);
        }
    }

    async updateAccount(id: string, updateData: UpdateAccountPayload) {
        try {
            const existingAccount = await this.prisma.account.findUnique({
                where: { id },
                include: {
                    assignedPlaces: true
                }
            });

            if (!existingAccount) {
                throw new NotFoundException(`Account with ID ${id} not found`);
            }

            // Check if username is being updated and if it's unique
            if (updateData.username && updateData.username !== existingAccount.username) {
                const existingUsername = await this.prisma.account.findUnique({
                    where: { username: updateData.username }
                });
                if (existingUsername) {
                    throw new BadRequestException('Username already exists');
                }
            }

            // Update account data
            const { assignedPlaces, ...accountData } = updateData;

            const updatedAccount = await this.prisma.$transaction(async (prisma) => {
                // Update account basic info
                const account = await prisma.account.update({
                    where: { id },
                    data: {
                        ...accountData,
                        updatedAt: new Date()
                    }
                });

                // Update assigned places if provided
                if (assignedPlaces !== undefined) {
                    // Remove existing assignments
                    await prisma.accountPlace.deleteMany({
                        where: { accountId: id }
                    });

                    // Add new assignments
                    if (assignedPlaces.length > 0) {
                        await prisma.accountPlace.createMany({
                            data: assignedPlaces.map(placeId => ({
                                accountId: id,
                                placeId
                            }))
                        });
                    }
                }

                // Return updated account with relations
                return await prisma.account.findUnique({
                    where: { id },
                    include: {
                        assignedPlaces: {
                            include: {
                                place: true
                            }
                        }
                    }
                });
            });

            return updatedAccount;
        } catch (error: unknown) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new InternalServerErrorException(`Failed to update account: ${errorMessage}`);
        }
    }

    async deleteAccount(id: string) {
        try {
            const existingAccount = await this.prisma.account.findUnique({
                where: { id }
            });

            if (!existingAccount) {
                throw new NotFoundException(`Account with ID ${id} not found`);
            }

            await this.prisma.$transaction(async (prisma) => {
                // Delete assigned places
                await prisma.accountPlace.deleteMany({
                    where: { accountId: id }
                });

                // Delete the account
                await prisma.account.delete({
                    where: { id }
                });
            });

            return { message: `Account with ID ${id} deleted successfully` };
        } catch (error: unknown) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new InternalServerErrorException(`Failed to delete account: ${errorMessage}`);
        }
    }
}
