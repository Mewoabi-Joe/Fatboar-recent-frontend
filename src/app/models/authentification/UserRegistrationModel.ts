import { Address } from './address';
export class UserRegistrationModel
{
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    fullName: string;
    siren: string;
    siret: string;
    type: string;
    address: Address;
    isLegalNoticeAccepted: boolean;
    newsLettre: boolean;
  }

