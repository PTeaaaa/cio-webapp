import { PrismaClient } from '@prisma/client';
import placesData from './data/places.json';
import { PlaceForm } from '@/types';

export async function seedPlaces(prisma: PrismaClient) {
    console.log('Seeding Places...');

    for (const place of placesData as PlaceForm[]) {
        try {
            const createdPlace = await prisma.place.upsert({
                where: { name: place.name },
                update: {
                    numberOrder: place.numberOrder,
                    name: place.name,
                    agency: place.agency
                },
                create: {
                    numberOrder: place.numberOrder,
                    name: place.name,
                    agency: place.agency
                },
            });
            console.log(`Upserted place: ${createdPlace.name} (ID: ${createdPlace.id})`);
        } catch (error) {
            console.error(`Error seeding place ${place.name}:`, error);
        }
    }
    console.log('Places seeding finished.');
}