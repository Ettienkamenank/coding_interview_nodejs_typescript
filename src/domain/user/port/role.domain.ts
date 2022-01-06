import { Role } from '@/domain/user/model/role.model';

export default interface RoleDomain {
    save(role: Role): Promise<Role | Error>;

    findRoleById(id: number): Promise<Role | Error>;

    findRoleByName(name: string): Promise<Role | Error>;

    findAllRoles(): Promise<Role[] | Error>;

    count(): Promise<number | Error>;
}
