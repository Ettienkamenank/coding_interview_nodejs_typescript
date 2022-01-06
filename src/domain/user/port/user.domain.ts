import {
    IRegisterUSer,
    IManageUserAccess,
    IFindUserAccount,
} from '@/domain/user/port/user.port';

export default interface UserDomain
    extends IRegisterUSer,
        IManageUserAccess,
        IFindUserAccount {}
