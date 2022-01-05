import { PrismaClient, User } from '@prisma/client';

declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
    }
    var prismaDev: PrismaClient;
}

// export {};
