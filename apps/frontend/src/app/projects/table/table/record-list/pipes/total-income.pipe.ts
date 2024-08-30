import { Pipe, PipeTransform } from '@angular/core';
import { Record } from '../../models/record';

@Pipe({
  name: 'totalIncome'
})
export class TotalIncomePipe implements PipeTransform {
  transform(records: Record[]): number {
    console.log('TotalIncomePipe transform called for records:', records);
    return records.reduce((total, record) => total + record.salary.reduce((sum, company) => sum + company.annualSalary, 0), 0);
  }
}