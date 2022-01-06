import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// prisma.$use(async (params, next) => {
//     if (params.model == 'User' && params.action == 'create') {
//         let user = params.args.data;
//         let hash = await bcrypt.hash(user.password, 10);
//         user.password = hash;
//     }
//     return await next(params);
// });

async function main() {
    /**
     * Seeding roles
     */
    const role1 = await prisma.role.upsert({
        where: { name: 'ACTUATOR' },
        update: {},
        create: {
            name: 'ACTUATOR',
        },
    });

    const role2 = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: {
            name: 'ADMIN',
        },
    });

    const role3 = await prisma.role.upsert({
        where: { name: 'USER' },
        update: {},
        create: {
            name: 'USER',
        },
    });

    /**
     * Seeding Actuator
     */
    let pass = 'grant';
    let password = await bcrypt.hash(pass, 10);

    const Actuator = await prisma.user.upsert({
        where: { username: 'actuator' },
        update: {},
        create: {
            firstName: 'Actuator',
            lastName: 'Test',
            username: 'actuator',
            email: 'actuator@gmail.com',
            phoneNumber: '+225 0700000000',
            enabled: true,
            password: password,
            roleId: role1.id,
        },
    });

    console.log({ role1, role2, role3, Actuator });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
