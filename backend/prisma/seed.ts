// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // // --- 1. Clear all old data to prevent errors ---
  // // We delete in a specific order to respect relationships
  // await prisma.personPlacement.deleteMany();
  // await prisma.accountPlace.deleteMany();
  // await prisma.person.deleteMany();
  // await prisma.place.deleteMany();
  // await prisma.account.deleteMany();
  
  // // --- 2. Create Accounts ---
  // const adminPassword = await bcrypt.hash('admin123', 10);
  // const userPassword = await bcrypt.hash('user123', 10);

  // const adminUser = await prisma.account.create({
  //   data: {
  //     username: 'admin', // make it short for development purpose
  //     password: adminPassword,
  //     role: 'admin',
  //   },
  // });

  // const placeUser = await prisma.account.create({
  //   data: {
  //     username: 'user',
  //     password: userPassword,
  //     role: 'user', // Changed to 'user' as per your plan
  //   },
  // });

  // console.log('Created accounts.');

  // // --- 3. Create Places ---
  // const placeA = await prisma.place.create({
  //   data: {
  //     name: 'โรงพยาบาลสุขสบาย',
  //     agency: 'Department',
  //   },
  // });

  // const placeB = await prisma.place.create({
  //   data: {
  //     name: 'คลินิกทันตกรรมยิ้มสวย',
  //     agency: 'Department',
  //   },
  // });

  // const placeC = await prisma.place.create({
  //   data: {
  //     name: 'ศูนย์ส่งเสริมสุขภาพที่ 1',
  //     agency: 'State',
  //   },
  // });
  
  // console.log('Created places.');

  // // --- 4. Create People ---
  // const person1 = await prisma.person.create({
  //   data: {
  //     prefix: 'นายแพทย์',
  //     name: 'สุรัคเมธ',
  //     surname: 'มหาศิริมงคล',
  //     email: 'saraban0212@moph.go.th',
  //     phone: '02 590 1214',
  //     position: 'ผู้อำนวยการศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร',
  //     department: 'สำนักงานปลัดกระทรวงสาธารณสุข',
  //     year: 2567
  //   },
  // });

  // const person2 = await prisma.person.create({
  //   data: {
  //     prefix: 'นายแพทย์',
  //     name: 'ณัฐพงศ์',
  //     surname: 'วงศ์วิวัฒน์',
  //     email: 'ddgnut2018@gmail.com',
  //     phone: '02 591 8236',
  //     position: 'รองอธิบดี กรมการแพทย์',
  //     department: 'กรมการแพทย์',
  //     year: 2567
  //   },
  // });

  // console.log('Created people.');

  // // --- 5. Create Relationships (The Important Part) ---

  // // Assign permissions for which user can see which place
  // // 'placeUser' can see Place A ('โรงพยาบาลสุขสบาย')
  // await prisma.accountPlace.create({
  //   data: {
  //     accountId: placeUser.id,
  //     placeId: placeA.id,
  //   },
  // });

  // // Assign which person belongs to which place
  // // John Doe works at Place A
  // await prisma.personPlacement.create({
  //   data: {
  //     personId: person1.id,
  //     placeId: placeA.id,
  //   },
  // });
  
  // // Jane Smith works at Place A AND Place B
  // await prisma.personPlacement.create({
  //   data: {
  //     personId: person2.id,
  //     placeId: placeA.id,
  //   },
  // });
  // await prisma.personPlacement.create({
  //   data: {
  //     personId: person2.id,
  //     placeId: placeB.id,
  //   },
  // });

  const place_De_A = await prisma.place.create({
    data: {
      name: 'สำนักงานปลัดกระทรวงสาธารณสุข',
      agency: 'Department',
    },
  });

  console.log('Created relationships.');
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