import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlaceSortBy } from './dto/get-places-by-agency.dto';

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

    async getPlacesByAgency(
        agency: string,
        page: number,
        limit: number,
        sortBy: PlaceSortBy = PlaceSortBy.NUMBER_ORDER,
        sortOrder: 'asc' | 'desc' = 'asc'
    ) {
        if (!agency) {
            throw new BadRequestException('Agency is required to query places.');
        }

        try {
            const skip = (page - 1) * limit;

            // First, check if any places exist for this agency (without pagination)
            const agencyExists = await this.prisma.place.findFirst({
                where: {
                    agency: agency,
                },
                select: {
                    id: true,
                }
            });

            // If no places found for this agency, throw NotFoundException
            if (!agencyExists) {
                throw new NotFoundException(`No places found for agency: ${agency}. Agency may not exist or has no places.`);
            }

            // Build dynamic orderBy object based on sortBy and sortOrder
            const orderBy: any = {};
            orderBy[sortBy] = sortOrder;

            const [places, total] = await this.prisma.$transaction([
                this.prisma.place.findMany({
                    where: {
                        agency: agency,
                    },
                    orderBy: orderBy,
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
            // Re-throw NotFoundException as-is
            if (error instanceof NotFoundException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new InternalServerErrorException(`Failed to fetch places by agency: ${errorMessage}`);
        }
    }

    async createManyPlaces(placesData: { name: string; agency: string }[]) {
        if (!placesData || placesData.length === 0) {
            throw new BadRequestException('Places data is required and cannot be empty');
        }

        // Validate each place data
        for (const place of placesData) {
            if (!place.name || !place.agency) {
                throw new BadRequestException('Each place must have both name and agency');
            }
            if (typeof place.name !== 'string' || typeof place.agency !== 'string') {
                throw new BadRequestException('Name and agency must be strings');
            }
        }

        try {
            // Check for duplicate names in the input data
            const names = placesData.map(p => p.name);
            const uniqueNames = new Set(names);
            if (names.length !== uniqueNames.size) {
                throw new BadRequestException('Duplicate place names found in the input data');
            }

            // Check if any of the places already exist in the database
            const existingPlaces = await this.prisma.place.findMany({
                where: {
                    name: {
                        in: names
                    }
                },
                select: {
                    name: true
                }
            });

            if (existingPlaces.length > 0) {
                const existingNames = existingPlaces.map(p => p.name);
                throw new ConflictException(`The following places already exist: ${existingNames.join(', ')}`);
            }

            // Get the highest numberOrder to continue the sequence
            const lastPlace = await this.prisma.place.findFirst({
                orderBy: {
                    numberOrder: 'desc'
                },
                select: {
                    numberOrder: true
                }
            });

            const startingNumber = (lastPlace?.numberOrder || 0) + 1;

            // Prepare data with numberOrder
            const placesWithOrder = placesData.map((place, index) => ({
                name: place.name.trim(),
                agency: place.agency.trim(),
                numberOrder: startingNumber + index
            }));

            // Create places using createMany
            const result = await this.prisma.place.createMany({
                data: placesWithOrder,
                skipDuplicates: false // We already checked for duplicates above
            });

            return {
                message: `Successfully created ${result.count} places`,
                count: result.count,
                createdPlaces: placesWithOrder.map(p => ({
                    name: p.name,
                    agency: p.agency
                }))
            };

        } catch (error: unknown) {
            // Re-throw known exceptions
            if (error instanceof BadRequestException || error instanceof ConflictException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new InternalServerErrorException(`Failed to create places: ${errorMessage}`);
        }
    }

    async deletePlaceById(id: string) {
        if (!id) {
            throw new BadRequestException('Place ID is required');
        }

        try {
            // Check if place exists
            const existingPlace = await this.prisma.place.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    agency: true,
                    people: {
                        select: { id: true }
                    },
                    assignedAccounts: {
                        select: { id: true }
                    }
                }
            });

            if (!existingPlace) {
                throw new NotFoundException(`Place with ID: ${id} not found`);
            }

            // Check if place has associated people or accounts
            if (existingPlace.people.length > 0) {
                throw new BadRequestException(`Cannot delete place "${existingPlace.name}" because it has ${existingPlace.people.length} associated people. Remove people first.`);
            }

            if (existingPlace.assignedAccounts.length > 0) {
                throw new BadRequestException(`Cannot delete place "${existingPlace.name}" because it has ${existingPlace.assignedAccounts.length} assigned accounts. Remove account assignments first.`);
            }

            // Delete the place
            await this.prisma.place.delete({
                where: { id }
            });

            return {
                message: `Successfully deleted place: ${existingPlace.name}`,
                deletedPlace: {
                    id: existingPlace.id,
                    name: existingPlace.name,
                    agency: existingPlace.agency
                }
            };

        } catch (error: unknown) {
            // Re-throw known exceptions
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new InternalServerErrorException(`Failed to delete place: ${errorMessage}`);
        }
    }

    async updatePlaceById(id: string, placeData: UpdatePlaceDto) {
        try {
            const updatedPlace = await this.prisma.place.update({
                where: { id },
                data: placeData,
            });
            return updatedPlace;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new InternalServerErrorException(`Failed to update place: ${errorMessage}`);
        }
    }

    async deleteManyPlaces(placeIds: string[]) {
        if (!placeIds || placeIds.length === 0) {
            throw new BadRequestException('Place IDs are required and cannot be empty');
        }

        // Validate that all IDs are provided
        for (const id of placeIds) {
            if (!id || typeof id !== 'string') {
                throw new BadRequestException('All place IDs must be valid strings');
            }
        }

        try {
            // Check which places exist and get their relationships
            const existingPlaces = await this.prisma.place.findMany({
                where: {
                    id: { in: placeIds }
                },
                select: {
                    id: true,
                    name: true,
                    agency: true,
                    people: {
                        select: { id: true }
                    },
                    assignedAccounts: {
                        select: { id: true }
                    }
                }
            });

            if (existingPlaces.length === 0) {
                throw new NotFoundException('No places found with the provided IDs');
            }

            // Check for missing places
            const foundIds = existingPlaces.map(p => p.id);
            const missingIds = placeIds.filter(id => !foundIds.includes(id));
            if (missingIds.length > 0) {
                throw new NotFoundException(`The following place IDs were not found: ${missingIds.join(', ')}`);
            }

            // Check for places with relationships
            const placesWithPeople = existingPlaces.filter(p => p.people.length > 0);
            const placesWithAccounts = existingPlaces.filter(p => p.assignedAccounts.length > 0);

            if (placesWithPeople.length > 0) {
                const placeNames = placesWithPeople.map(p => p.name);
                throw new BadRequestException(`Cannot delete the following places because they have associated people: ${placeNames.join(', ')}. Remove people first.`);
            }

            if (placesWithAccounts.length > 0) {
                const placeNames = placesWithAccounts.map(p => p.name);
                throw new BadRequestException(`Cannot delete the following places because they have assigned accounts: ${placeNames.join(', ')}. Remove account assignments first.`);
            }

            // Delete all places
            const deleteResult = await this.prisma.place.deleteMany({
                where: {
                    id: { in: placeIds }
                }
            });

            return {
                message: `Successfully deleted ${deleteResult.count} places`,
                count: deleteResult.count,
                deletedPlaces: existingPlaces.map(p => ({
                    id: p.id,
                    name: p.name,
                    agency: p.agency
                }))
            };

        } catch (error: unknown) {
            // Re-throw known exceptions
            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new InternalServerErrorException(`Failed to delete places: ${errorMessage}`);
        }
    }


}