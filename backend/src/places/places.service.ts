import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlacesService {
    constructor(private readonly prisma: PrismaService) { }

    async getAllPlaces() {
        try {
            const places = await this.prisma.place.findMany({
                orderBy: {
                    numberOrder: 'asc',
                },
                select: {
                    id: true,
                    name: true,
                    agency: true,
                },
            });

            return places;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new InternalServerErrorException(`Failed to fetch all places: ${errorMessage}`);
        }
    }

    async getPlaceById(id: string) {
        const place = await this.prisma.place.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                agency: true,
            },
        });

        if (!place) {
            throw new NotFoundException(`Place with ID: ${id}, not found`);
        }

        return place;
    }

    async getPlacesByAgency(agency: string, page: number, limit: number) {

        if (!agency) {
            throw new BadRequestException('Agency is required to query places.');
        }

        try {
            const skip = (page - 1) * limit;

            const [places, total] = await this.prisma.$transaction([
                this.prisma.place.findMany({
                    where: {
                        agency: agency,
                    },
                    orderBy: {
                        numberOrder: 'asc',
                    },
                    skip: skip,
                    take: limit,
                }),
                this.prisma.place.count({
                    where: {
                        agency: agency,
                    },
                }),
            ]);

            return {
                data: places,
                meta: {
                    total,
                    page,
                    limit,
                    lastPage: Math.ceil(total / limit),
                }
            };

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new InternalServerErrorException(`Failed to fetch places by agency: ${errorMessage}`);
        }
    }
}