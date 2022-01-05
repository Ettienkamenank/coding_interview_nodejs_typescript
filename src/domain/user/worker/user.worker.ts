import prisma from '@/infrastructure/config/prisma.config';
import token from '@/utils/token';
import bcrypt from 'bcrypt';

class UserWorker {
    /**
     * Register a new user
     */
    public async register(
        name: string,
        email: string,
        username: string,
        password: string
    ): Promise<String | Error> {
        try {
            const hash = await bcrypt.hash(password, 10);
            password = hash;

            const user = await prisma.user.create({
                data: { name, email, username, password },
            });

            const accessToken = token.createToken(user.id.toString());

            return accessToken;
        } catch (err) {
            throw new Error('Unable to create new user');
        }
    }

    /**
     * Attempt to login a user
     */
    public async login(
        email: string,
        password: string
    ): Promise<String | Error> {
        try {
            const user = await prisma.user.findUnique({
                where: { email: email },
            });

            if (user) {
                if (await this.isValidPassword(password, user.password!)) {
                    return token.createToken(user.id.toString());
                } else {
                    throw new Error('Wrong credentials given');
                }
            } else {
                throw new Error('Unable to find user with that email address');
            }
        } catch (err) {
            throw new Error('Unable to login user');
        }
    }

    private async isValidPassword(
        password: string,
        passwordEncrypted: string
    ): Promise<Error | boolean> {
        return await bcrypt.compare(password, passwordEncrypted);
    }
}

export default UserWorker;
