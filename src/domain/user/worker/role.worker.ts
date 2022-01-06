import prisma from '@/infrastructure/config/prisma.config';
import RoleDomain from '@/domain/user/port/role.domain';
import { Role } from '@/domain/user/model/role.model';
import { Prisma } from '@prisma/client';

class RoleWorker implements RoleDomain {
    /**
     * Create a new role
     */
    public async save(role: Role): Promise<Role | Error> {
        try {
            if (role) {
                const result = await prisma.role.create({
                    data: role,
                });

                if (result) {
                    return result;
                } else {
                    throw new Error('Unable to save role');
                }
            } else {
                throw new Error('No role to save');
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }

    /**
     * Find role by is id
     */
    public async findRoleById(id: number): Promise<Role | Error> {
        try {
            const role = await prisma.role.findUnique({ where: { id: id } });

            if (role) {
                return role;
            } else {
                throw new Error('Unable to find role with that id');
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }

    /**
     * Find role by is name
     */
    public async findRoleByName(name: string): Promise<Role | Error> {
        try {
            const role = await prisma.role.findUnique({
                where: { name: name },
            });

            if (role) {
                return role;
            } else {
                throw new Error('Unable to find role with this name');
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }

    /**
     * Find all roles
     */
    public async findAllRoles(): Promise<Role[] | Error> {
        try {
            const roles = await prisma.role.findMany({});

            if (roles.length > 0) {
                return roles;
            } else {
                throw new Error('Unable to fetch roles');
            }
        } catch (err: any) {
            throw new Error(err);
        }
    }

    /**
     * Count roles
     */
    public async count(): Promise<number | Error> {
        try {
            const roles = await prisma.role.count();

            return roles;
        } catch (err: any) {
            throw new Error(err);
        }
    }
}

export default RoleWorker;
