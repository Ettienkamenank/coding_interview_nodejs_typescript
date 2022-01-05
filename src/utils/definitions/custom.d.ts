import { PrismaClient } from '@prisma/client';

type User = {
    id: number;
    email: string;
    username: string;
    name: string | null;
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
