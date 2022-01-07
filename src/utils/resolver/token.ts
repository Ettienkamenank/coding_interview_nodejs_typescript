import jwt from 'jsonwebtoken';
import Token from '@/utils/interfaces/token.interface';
import { User } from '@/domain/user/model/user.model';

export const createToken = (user: User): string => {
    return jwt.sign(
        { id: user.username },
        process.env.JWT_SECRET as jwt.Secret,
        {
            expiresIn: '1d',
        }
    );
};

export const verifyToken = async (
    token: string
): Promise<jwt.VerifyErrors | Token> => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            process.env.JWT_SECRET as jwt.Secret,
            (err, payload) => {
                if (err) return reject(err);

                resolve(payload as Token);
            }
        );
    });
};

export const verifyAppSecret = async (
    token: string
): Promise<Error | boolean> => {
    return new Promise((resolve, reject) => {
        if (token === process.env.APP_SECRET) {
            return resolve(true);
        } else {
            return reject(new Error('Wrong token'));
        }
    });
};

export default { createToken, verifyToken, verifyAppSecret };
