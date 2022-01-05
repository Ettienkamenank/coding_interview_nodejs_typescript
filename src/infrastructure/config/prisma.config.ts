import { PrismaClient } from '@prisma/client';

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

if (process.env.NODE_ENV === 'development') global.prismaDev = prisma;

// export const TryDBConnect = async (onError: Function, next?: Function) => {
//     try {
//         await prisma
//             .$connect()
//             .then(() => console.log('Prisma connected to database...'))
//             .catch((err) => console.log(err));

//         if (next) {
//             next();
//         }
//     } catch (e) {
//         onError();
//     }
// };

export default prisma;
