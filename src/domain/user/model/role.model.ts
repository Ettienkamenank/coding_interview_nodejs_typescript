export interface Role {
    id: number;
    name: string;
    description: string | null;
}

export enum RoleType {
    ACTUATOR = 'ACTUATOR',
    ADMIN = 'ADMIN',
    USER = 'USER',
}
