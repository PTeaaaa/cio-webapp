import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface UpdateAccountPayload {
    username?: string;
    role?: string;
    isActive?: boolean;
    assignedPlaces?: string[];
}

@Injectable()
export class AccountsService {

    constructor(private readonly prisma: PrismaService) { }

    async createAccount(username: string, password: string, role: string, assignPlace: string[]) {
        // Validate input
        if (!username || username.trim().length < 3) {
            throw new BadRequestException('Username must be at least 3 characters long');
        }

        if (!password || password.length < 6) {
            throw new BadRequestException('Password must be at least 6 characters long');
        }

        if (!['admin', 'user'].includes(role)) {
            throw new BadRequestException('Invalid role. Must be admin or user');
        }

        // Check if username already exists
        const existingAccount = await this.prisma.account.findUnique({
            where: { username: username.trim() },
        });

        if (existingAccount) {
            throw new ConflictException('Username already exists');
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create account with assigned places in a transaction
            const result = await this.prisma.$transaction(async (prisma) => {
                // Create the account
                const account = await prisma.account.create({
                    data: {
                        username: username.trim(),
                        password: hashedPassword,
                        role,
                    },
                });

                // Create account-place relationships if assignPlace is provided
                if (assignPlace && assignPlace.length > 0) {
                    // Validate that all place IDs exist
                    const existingPlaces = await prisma.place.findMany({
                        where: {
                            id: { in: assignPlace }
                        }
                    });

                    if (existingPlaces.length !== assignPlace.length) {
                        throw new BadRequestException('One or more place IDs are invalid');
                    }

                    // Create account-place relationships
                    await prisma.accountPlace.createMany({
                        data: assignPlace.map(placeId => ({
                            accountId: account.id,
                            placeId: placeId
                        })),
                        skipDuplicates: true
                    });
                }

                return account;
            });

            // Return user without password
            const { password: _, ...accountResult } = result;
            return accountResult;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Failed to create account');
        }
    }

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
