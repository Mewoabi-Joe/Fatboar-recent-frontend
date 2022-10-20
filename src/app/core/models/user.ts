import { Role } from './role';
import { Owner } from './owner';
import { Address } from './address';

export interface User {
    id?: number;
    username?: string;
    password?: string;
    email?: string;
    type?: Role;
    token?: string;
    refreshToken?: string;
    authExpiration?: string;
    refreshExpiration?: string;
    owner?: Owner;
    address?: Address;
    emailStatus?: string;
    fullName?: string;
    birthDate?: string;
    firstName?: string;
    lastName?: string;
    provider?: string;

}
