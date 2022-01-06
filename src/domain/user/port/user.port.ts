import { UserDto, User } from '@/domain/user/model/user.model';

export interface IRegisterUSer {
    isEmailAlreadyTaken(email: string): Promise<Boolean | Error>;

    isUsernameAlreadyTaken(username: string): Promise<Boolean | Error>;

    createUser(user: User): Promise<String | Error>;
}

export interface IManageUserAccess {
    authenticateUser(
        username: string,
        password: string
    ): Promise<String | Error>;

    lockUserAccount(username: string): Promise<Boolean | Error>;

    unlockUserAccount(username: string): Promise<Boolean | Error>;

    updateUserPassword(username: string): Promise<Boolean | Error>;
}

export interface IFindUserAccount {
    findUserByUsername(username: string): Promise<UserDto | Error>;

    findUserByEmail(email: string): Promise<UserDto | Error>;

    findUserById(id: number): Promise<UserDto | Error>;
}
