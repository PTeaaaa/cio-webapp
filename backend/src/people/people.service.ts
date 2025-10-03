import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from "@/prisma/prisma.service";
import { SessionUser } from "@/auth/auth.service";
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { MinioService } from '@/minio/minio.service';

@Injectable()
export class PeopleService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly minioService: MinioService,
    ) { }

    async getPeopleByPlaceId(id: string) {
        const people = await this.prisma.person.findMany({
            where: { placeId: id },
        });

        if (people.length === 0) {
            throw new NotFoundException(`No people found for place with ID: ${id}`);
        }

        return people;
    }

    async getPeopleByPlaceIdPublic(placeId: string, page: number, limit: number) {

        if (!placeId) {
            throw new BadRequestException('Agency is required to query places.');
        }

        try {
            const skip = (page - 1) * limit;

            const [places, total] = await this.prisma.$transaction([
                this.prisma.person.findMany({
                    where: {
                        placements: {
                            some: {
                                placeId: placeId,
                            }
                        },
                    },
                    orderBy: {
                        year: 'desc',
                    },
                    skip: skip,
                    take: limit,
                }),
                this.prisma.person.count({
                    where: {
                        placements: {
                            some: {
                                placeId: placeId,
                            }
                        },
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

    async getPersonByPersonId(personId: string) {
        const person = await this.prisma.person.findUnique({
            where: { id: personId },
        })

        if (!person) {
            throw new NotFoundException(`Person with id ${personId} not found`);
        }

        return person;
    }

    async createPerson(createPersonDto: CreatePersonDto) {

        try {
            const { placeId, ...personData } = createPersonDto;

            return this.prisma.$transaction(async (tx) => {
                // Include placeId in person data since it's part of the Person model
                const newPerson = await tx.person.create({
                    data: {
                        ...personData,
                        placeId: placeId, // Include placeId in person record
                    },
                });

                // Also create the placement relationship
                await tx.personPlacement.create({
                    data: {
                        personId: newPerson.id,
                        placeId: placeId,
                    }
                });

                return newPerson;
            });
        } catch (error) {
            console.error('Error creating person:', error);
            throw error;
        }
    }

    async updatePerson(user: SessionUser, personId: string, updatePersonDto: UpdatePersonDto) {

        // Check if person exists
        const existingPerson = await this.prisma.person.findUnique({
            where: { id: personId },
        });

        if (!existingPerson) {
            throw new NotFoundException('Person not found');
        }

        const { placeId, ...personData } = updatePersonDto;

        return this.prisma.$transaction(async (tx) => {
            // Update person record
            const updatedPerson = await tx.person.update({
                where: { id: personId },
                data: personData,
            });

            // Handle place reassignment if placeId is provided
            if (placeId !== undefined) {
                // Remove existing placements
                await tx.personPlacement.deleteMany({
                    where: { personId: personId },
                });

                // Create new placement
                await tx.personPlacement.create({
                    data: {
                        personId: personId,
                        placeId: placeId,
                    },
                });
            }

            return updatedPerson;
        });
    }

    async uploadPersonImage(file: Express.Multer.File, personId: string): Promise<string> {
        if (!file) {
            throw new BadRequestException('No file provided for upload.');
        }

        try {
            // 1. อัปโหลดไฟล์ไปยัง MinIO
            const imageUrl = await this.minioService.uploadFile(file);

            // 2. บันทึก URL ของรูปภาพลงในฐานข้อมูลสำหรับ Person โดยใช้ Prisma
            const updatedPerson = await this.prisma.person.update({
                where: { id: personId },
                data: { imageUrl },
            });

            if (!updatedPerson) {
                throw new NotFoundException(`Person with ID "${personId}" not found.`);
            }

            return imageUrl; // คืนค่า URL ของรูปภาพที่อัปโหลด
        }
        catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            // Log error และ throw InternalServerErrorException
            throw new InternalServerErrorException(`Failed to upload and save image: ${errorMessage}`);
        }
    }

    async deletePerson(user: SessionUser, personId: string): Promise<{ message: string }> {

        // Check if person exists
        const existingPerson = await this.prisma.person.findUnique({
            where: { id: personId },
        });

        if (!existingPerson) {
            throw new NotFoundException('Person not found');
        }

        return this.prisma.$transaction(async (tx) => {
            // Delete associated placements first
            await tx.personPlacement.deleteMany({
                where: { personId: personId },
            });

            // Delete the person record
            await tx.person.delete({
                where: { id: personId },
            });

            return { message: 'Person deleted successfully' };
        });
    }

}
