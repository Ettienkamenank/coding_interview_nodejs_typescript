import { PrismaClient } from '@prisma/client';

type User = {
    id: number;
    lastName: string | null;
    firstName: string | null;
    username: string;
    email: string;
    roleId: number | null;
};

declare global {
    var prismaDev: PrismaClient;

    namespace Express {
        export interface Request {
            user: User;
        }
    }
}

// export {};
