import { PartialType } from '@nestjs/mapped-types';
import { CreateRecordDto } from './create-record.dto';
import { Company } from '../entities/company.interface';
import { Phone, Address } from '../entities/record.interface';

export class UpdateRecordDto extends PartialType(CreateRecordDto) {
    UID?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    address?: Address;
    city?: string;
    state?: string;
    zip?: string;
    phone?: Phone;
    salary?: Company[];
    totalHouseholdIncome?: number;
}
