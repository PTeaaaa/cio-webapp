import { PrismaClient, Person } from '@prisma/client';
import peopleData from './data/people.json';
import { PersonFormSeeding, PersonPlacementSeeding } from '@/types';

export async function seedPeople(prisma: PrismaClient) {
    console.log('Seeding People...');

    const results = {
        success: 0,
        failed: 0,
        errors: [] as Array<{ name: string; error: string }>
    };

    const createdPeople: Person[] = [];

    for (const person of peopleData as PersonFormSeeding[]) {
        try {
            const createdPerson = await prisma.person.upsert({
                where: {
                    name_surname_year: {
                        name: person.name,
                        surname: person.surname,
                        year: person.year
                    }
                },
                update: {
                    prefix: person.prefix,
                    surname: person.surname,
                    email: person.email,
                    phone: person.phone,
                    position: person.position,
                    department: person.department,
                    year: person.year
                },
                create: {
                    prefix: person.prefix,
                    name: person.name,
                    surname: person.surname,
                    email: person.email,
                    phone: person.phone,
                    position: person.position,
                    department: person.department,
                    year: person.year
                },
            });

            console.log(`Upserted person: ${createdPerson.name} (ID: ${createdPerson.id})`);
            results.success++;

            createdPeople.push(createdPerson);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`Error seeding person ${person.name}:`, errorMessage);

            results.failed++;
            results.errors.push({
                name: person.name,
                error: errorMessage
            });
        }
    }

    console.log(`Summary: ${results.success} success, ${results.failed} failed`);
    if (results.errors.length > 0) {
        console.log('Failed entries:', results.errors);
    }

    console.log('--- Creating relation People-Place relation ---');

    for (const person of createdPeople) {
        try {
            const place = await prisma.place.findUnique({
                where: { name: person.department }
            });

            if (!place) {
                console.warn(`[WARN] ไม่พบสถานที่: ${person.department}`);
                continue;
            }

            // สร้างความสัมพันธ์ในตาราง PersonPlacement
            await prisma.personPlacement.upsert({
                where: {
                    personId_placeId: {
                        personId: person.id,
                        placeId: place.id
                    }
                },
                update: {},
                create: {
                    personId: person.id,
                    placeId: place.id,
                }
            });

            // อัปเดต placeId ในตาราง Person (ถ้าจำเป็น)
            await prisma.person.update({
                where: { id: person.id },
                data: { placeId: place.id }
            });

            console.log(`Created relation for ${person.name} with ${place.name}`);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`Error creating relation for ${person.name}:`, errorMessage);
        }
    }
    console.log('--- Finished creating People-Place relations ---');

}