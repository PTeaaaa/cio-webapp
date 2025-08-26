import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import authsData from './data/auths.json';

export async function seedAuths(prisma: PrismaClient) {
    for (const auth of authsData) {
        try {
            const hashedPassword = await bcrypt.hash(auth.password, 10);

            const createdAccount = await prisma.account.upsert({
                where: { username: auth.username },
                update: {
                    password: hashedPassword,
                    role: auth.role
                },
                create: {
                    username: auth.username,
                    password: hashedPassword,
                    role: auth.role
                },
            });
            console.log(`Upserted place: ${createdAccount.username} (ID: ${createdAccount.id}) (Role: ${createdAccount.role})`);
        } catch (error) {
            console.error(`Error seeding place ${auth.username}:`, error);
        }
    }

    const place_connectTo_user1 = await prisma.place.findUnique({
        where: { name: "กรมการแพทย์" }
    });
    if (!place_connectTo_user1) throw new Error("Place กรมการแพทย์ not found");

    const account_user1 = await prisma.account.findUnique({
        where: { username: "user1" }
    })
    if (!account_user1) throw new Error("user1 not found");

    await prisma.accountPlace.upsert({
        where: {
            accountId_placeId: {
                accountId: account_user1.id,
                placeId: place_connectTo_user1.id
            }
        },
        update: {},
        create: {
            accountId: account_user1.id,
            placeId: place_connectTo_user1.id,
        },
    });

    console.log('Places seeding finished.');

    console.log('Created accounts.');
}