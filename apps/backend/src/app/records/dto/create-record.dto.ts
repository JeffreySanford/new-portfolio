import { Company } from "../entities/company.entity";
import { Phone, Address } from "../entities/record.entity";

export class CreateRecordDto {
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
