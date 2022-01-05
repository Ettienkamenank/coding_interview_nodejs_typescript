import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/token';
import prisma from '@/infrastructure/config/prisma.config';
import Token from '@/utils/interfaces/token.interface';
import HttpException from '@/utils/exceptions/http.exception';
import jwt from 'jsonwebtoken';

async function authenticatedMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401, 'Unauthorized, no bearer'));
    }

    const accessToken = bearer.split('Bearer ')[1].trim();

    try {
        const payload: Token | jwt.JsonWebTokenError = await verifyToken(
            accessToken
        );

        if (payload instanceof jwt.JsonWebTokenError) {
            return next(new HttpException(401, 'Unauthorized, no payload'));
        }

        const user = await prisma.user.findUnique({
            where: { username: payload.id },
            select: { id: true, email: true, username: true, name: true },
        });

        if (!user) {
            return next(new HttpException(401, 'Unauthorized, user not found'));
        }

        req.user = user;
        return next();
    } catch (error) {
        // return next(error);
        return next(new HttpException(401, 'Unauthorized, error'));
    }
}

export default authenticatedMiddleware;
