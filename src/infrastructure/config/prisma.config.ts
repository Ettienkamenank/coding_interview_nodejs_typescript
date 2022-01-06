import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma =
    global.prismaDev ||
    new PrismaClient({
        errorFormat: 'pretty',
        log: [
            { level: 'query', emit: 'event' },
            { level: 'warn', emit: 'event' },
            { level: 'info', emit: 'event' },
            { level: 'error', emit: 'event' },
        ],
    });

/**
 * Encrypt password before create a new user
 */
prisma.$use(async (params, next) => {
    if (params.model == 'User' && params.action == 'create') {
        let user = params.args.data;
        let hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
    }
    return await next(params);
});

if (process.env.NODE_ENV === 'development') global.prismaDev = prisma;

export default prisma;
