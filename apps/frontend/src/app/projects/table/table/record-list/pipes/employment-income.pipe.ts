import { Pipe, PipeTransform } from '@angular/core';
import { Company } from '../models/company';

@Pipe({
  name: 'employmentIncome'
})
export class EmploymentIncomePipe implements PipeTransform {
  transform(companies: Company[]): number {
    return companies.reduce((total, company) => total + company.annualSalary, 0);
  }
}