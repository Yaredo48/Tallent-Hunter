import { PrismaClient } from '@talent/database';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    const email = 'e2e-test-user@example.com';
    const password = 'TestPassword123!';
    const orgId = 'e2e-org';

    let org = await prisma.organization.findUnique({
        where: { id: orgId }
    });

    if (!org) {
        org = await prisma.organization.create({
            data: {
                id: orgId,
                name: 'E2E Organization',
                slug: 'e2e-org',
            }
        });
        console.log('Created E2E organization');
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (!existingUser) {
        const passwordHash = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                passwordHash,
                firstName: 'Test',
                lastName: 'User',
                role: 'ORG_ADMIN',
                organizationId: org.id,
            }
        });
        console.log('Created test user');
    } else {
        console.log('Test user already exists');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
