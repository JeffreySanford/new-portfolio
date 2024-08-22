import { Component, OnDestroy, OnInit } from '@angular/core';
import { Company } from '../../models/company';
import { Record } from '../../models/record';
import { RecordService } from '../record.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-record-detail',
  templateUrl: './record-detail.component.html',
  styleUrl: './record-detail.component.scss'
})
export class RecordDetailComponent implements OnInit, OnDestroy {
  user?: Record;
  totalAnnualSalary = 0;
  salaryDisplayedColumns!: string[];
  salaryArray!: Company[];
  selectedUserId!: string;

  userSub: Subscription;

  constructor(private recordService: RecordService, private router: Router) {
    this.selectedUserId = recordService.getSelectedUID();
    if (this.selectedUserId === "0000000") {
      this.router.navigate(['/records']);
    }

    this.userSub = this.recordService.getRecordByUID(this.selectedUserId).subscribe((user: Record) => {
      this.user = user;
      /**
       *  UID: "714270642"
          address:  {city: 'El Paso', state: 'Illinois', street: '496 Blanda  Brooks', zipcode: '99313'}; 
          avatar: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/93.jpg"
          firstName: "Brigitte"
          flicker: "https://loremflickr.com/640/480?lock=1424346534903808"
          lastName: "Rutherford"
          phone: {number: '028-385-4769', areaCode: '028', hasExtension: true, extension: '8849'}
          salary: 
            (4) [{…}, {…}, {…}, {…}]
          totalHouseholdIncome: 31000537
       */
      this.user.address.street = user.address.street;
      this.user.address.city = user.address.city;
      this.user.address.state = user.address.state;
      this.user.address.zipcode = user.address.zipcode;

      this.user.phone.areaCode = user.phone.areaCode;
      this.user.phone.phone = user.phone.number.substring(4, 7) + '-' + user.phone.number.substring(8, 12);
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.salaryDisplayedColumns = ['company', 'salary'];
  }

  public getTotalSalary(): number {
    this.totalAnnualSalary = 0;
    this.user?.salary.forEach((company: Company) => {
      this.totalAnnualSalary += company.annualSalary;
    });

    return this.totalAnnualSalary
  }
}
