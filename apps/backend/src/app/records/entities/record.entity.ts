import { Company } from "./company.entity";

export interface Phone {
    number: string;
    hasExtension: boolean;
    extension: string;
    areaCode: string;
}

export interface Address {
    street: string;
    city: string;
    state: string;
    zipcode: string;
}

export class Record {
    UID: string;
    avatar: any;
    flicker: any;
    name?: string;
    firstName: string;
    lastName: string;
    address: Address;
    phone: Phone;
    salary: Company[];
    totalHouseholdIncome: number;
}
