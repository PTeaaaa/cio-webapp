// prisma/seed/index.ts
import { PrismaClient } from '@prisma/client';
import { seedPlaces } from './places.seed';
import { seedAuths } from './auths.seed';
import { seedPeople } from './people.seed'; 

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  await seedPlaces(prisma);
  await seedPeople(prisma);
  await seedAuths(prisma);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });