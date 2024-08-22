import { Company } from "./company.interface";

export interface Phone {
    number: string;
    hasExtension: boolean;
    extension: string | null;
    areaCode: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipcode: string;
}

export interface Record {
    UID: string;
    avatar: string;
    flicker: string;
    firstName: string;
    lastName: string;
    address: Address;
    phone: Phone;
    salary: Company[];
    totalHouseholdIncome: number;
}