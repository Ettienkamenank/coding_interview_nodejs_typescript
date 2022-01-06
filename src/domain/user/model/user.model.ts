export interface User {
    lastName: string | null;
    firstName: string | null;
    username: string;
    email: string;
    photo: string | null;
    phoneNumber: string | null;
    phoneNumber2: string | null;
    country: string | null;
    city: string | null;
    department: string | null;
    address: string | null;
    postalCode: string | null;
    roleId: number;
    language: string | null;
    password: string;
    locked: boolean;
    enabled: boolean;
    credentialsExpired: boolean;
}

export interface UserDto {
    id: number;
    lastName: string | null;
    firstName: string | null;
    username: string;
    email: string;
    photo: string | null;
    phoneNumber: string | null;
    phoneNumber2: string | null;
    country: string | null;
    city: string | null;
    department: string | null;
    address: string | null;
    postalCode: string | null;
    roleId: number;
    language: string | null;
}
