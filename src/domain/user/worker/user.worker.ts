import prisma from '@/infrastructure/config/prisma.config';
import UserDomain from '@/domain/user/port/user.domain';
import { User, UserDto } from '@/domain/user/model/user.model';
import token from '@/utils/token';
import bcrypt from 'bcrypt';

class UserWorker implements UserDomain {
    /**
     * Check if the email is already in use by a user
     */
    public async isEmailAlreadyTaken(email: string): Promise<Boolean | Error> {
        try {
            const user = await prisma.user.findUnique({
                where: { email: email },
            });

            if (user) {
                return true;
            } else {
                return false;
            }
        } catch (err: any) {
            throw new Error('Unable to find user with that email address');
        }
    }

    /**
     * Check if the username is already in use by a user
     */
    public async isUsernameAlreadyTaken(
        username: string
    ): Promise<Boolean | Error> {
        try {
            const user = await prisma.user.findUnique({
                where: { username: username },
            });

            if (user) {
                return true;
            } else {
                return false;
            }
        } catch (err: any) {
            throw new Error('Unable to find user with that username');
        }
    }

    /**
     * Create a new user
     */
    public async createUser(user: User): Promise<String | Error> {
        try {
            if (user) {
                const result = await prisma.user.create({
                    data: user,
                });

                if (result) {
                    const accessToken = token.createToken(user);
                    return accessToken;
                } else {
                    throw new Error('Unable to save user');
                }
            } else {
                throw new Error('No user to save');
            }
        } catch (err: any) {
            throw new Error(err);
            // throw new Error('Unable to create new user');
        }
    }

    /**
     * Attempt to authenticate a user
     */
    public async authenticateUser(
        username: string,
        password: string
    ): Promise<String | Error> {
        try {
            let user: User | null;

            user = await prisma.user.findUnique({
                where: { username: username },
            });

            if (user) {
                if (await this.isValidPassword(password, user.password)) {
                    return token.createToken(user);
                } else {
                    throw new Error('Wrong credentials given');
                }
            } else {
                throw new Error('Wrong credentials given');
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }

    /**
     * Lock user account
     */
    public async lockUserAccount(username: string): Promise<Boolean | Error> {
        try {
            const updatedUser = await prisma.user.update({
                where: { username: username },
                data: { locked: true },
            });

            if (updatedUser) {
                return true;
            } else {
                return false;
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }

    /**
     * Unlock user account
     */
    public async unlockUserAccount(username: string): Promise<Boolean | Error> {
        try {
            const updatedUser = await prisma.user.update({
                where: { username: username },
                data: { locked: false },
            });

            if (updatedUser) {
                return true;
            } else {
                return false;
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }

    /**
     * Update a user password
     */
    public async updateUserPassword(
        username: string
    ): Promise<Boolean | Error> {
        throw new Error('Method not implemented.');
    }

    /**
     * Find a user by is username
     */
    public async findUserByUsername(
        username: string
    ): Promise<Error | UserDto> {
        try {
            let user: UserDto | null;

            user = await prisma.user.findUnique({
                where: { username: username },
            });

            if (user) {
                return user;
            } else {
                throw new Error('Unable to find user with that username');
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }

    /**
     * Find a user by is email address
     */
    public async findUserByEmail(email: string): Promise<Error | UserDto> {
        try {
            let user: UserDto | null;

            user = await prisma.user.findUnique({
                where: { email: email },
            });

            if (user) {
                return user;
            } else {
                throw new Error('Unable to find user with that email address');
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }

    /**
     * Find a user by is id
     */
    public async findUserById(id: number): Promise<Error | UserDto> {
        try {
            let user: UserDto | null;

            user = await prisma.user.findUnique({
                where: { id: id },
            });

            if (user) {
                return user;
            } else {
                throw new Error('Unable to find user with that id');
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }

    /**
     * Private function to serve the purposes of this class
     */
    private async isValidPassword(
        password: string,
        passwordEncrypted: string
    ): Promise<Error | boolean> {
        return await bcrypt.compare(password, passwordEncrypted);
    }
}

export default UserWorker;
