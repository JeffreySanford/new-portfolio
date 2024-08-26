import { Company } from "../entities/company.interface";
import { Phone, Address } from "../entities/record.interface";

export class CreateRecordDto {
    UID: string;
    name?: string;
    firstName: string;
    lastName: string;
    address: Address;
    phone: Phone;
    salary: Company[];
    totalHouseholdIncome: number;

    constructor() {
        this.UID = '';
        this.name = '';
        this.firstName = '';
        this.lastName = '';
        this.address = { street: '', city: '', state: '', zipcode: '' };
        this.phone = { number: '', hasExtension: false, extension: null, areaCode: '' };
        this.salary = [];
        this.totalHouseholdIncome = 0;
    }
}
