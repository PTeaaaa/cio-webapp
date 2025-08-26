import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
const prisma = new PrismaClient();

async function main() {
    const userId = '20ec52eb-0ab2-4166-af20-ff6b79af18af';
    const sid = randomBytes(32).toString('base64url');
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);


    await prisma.account.update({
        where: { id: userId },
        data: {
            sessionId: sid,
            sessionExpiredAt: expires,
            sessionRevokedAt: null,
            // (ถ้าจะผูกกับอุปกรณ์/IP ใน Step 2 ค่อยใส่ตอน login จริง)
        },
    });

    console.log('sid =', sid);
}
main().finally(() => prisma.$disconnect());