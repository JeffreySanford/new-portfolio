import { AfterContentChecked, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { Record } from '../models/record';
import { Company } from '../models/company';
import { RecordService } from './record.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list-component.html',
  styleUrl: './record-list-component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})

export class RecordListComponent implements OnInit, AfterContentChecked, OnDestroy {
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  rowExpanded = false;
  totalRecords = 0;
  filterValue = '';
  pageSizeOptions = [5, 25, 100, 1000];
  dataSetSizes = [5, 15000, 100000, 1000000];
  resolved = false;
  time?: Date;
  expandedElement?: Record | null;
  dataSource = new MatTableDataSource<Record, MatPaginator>([]);
  pageSize?: number;
  startTime?: () => number;
  generationTimeLabel = '';
  roundtripLabel = '';
  showMinimalColumns = false;

  displayedColumns: string[] = ['userID', 'name', 'address', 'city', 'state', 'zip', 'phone', 'icons'];
  generateNewRecordSub?: Subscription;
  creationTimeSub?: Subscription;
  dataset: Record[] = [];
  showAddressColumns = true;
  showMediumColumns = true;

  constructor(
    private router: Router,
    private recordService: RecordService

  ) { }

  // Method to toggle column visibility based on screen size
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    debugger
    this.updateDisplayedColumns();
  }

  //  Sort data based on column and direction
  sortData(event: any): void {
    this.sort.active = event.active;
    this.sort.direction = event.direction;
    this.dataSource.sort = this.sort;
    debugger
  }

  // Update the displayed columns based on visibility settings
  updateDisplayedColumns(): void {
    const width = window.innerWidth;
    if (width < 1000) {
      this.displayedColumns = ['userID', 'name', 'icons'];
    } else if (width < 1200) {
      this.displayedColumns = ['userID', 'name', 'state', 'zip', 'icons'];
    } else if (width < 1400) {
      this.displayedColumns = ['userID', 'name', 'city', 'state', 'zip', 'icons'];
    } else {
      this.displayedColumns = ['userID', 'name', 'address', 'city', 'state', 'zip', 'phone', 'icons'];
    }
  }

  ngAfterContentChecked() {
    if (!this.resolved && this.dataset.length > 0) {
      this.dataSource.data = this.dataset;
      this.totalRecords = this.dataSource.data.length;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data: Record, filter: string) => {
        return data.UID.toLowerCase().includes(filter);
      };
      this.updateDisplayedColumns();
      this.resolved = true;
    }
  }
  
  ngOnDestroy(): void {
    if (this.generateNewRecordSub) {
      this.generateNewRecordSub.unsubscribe();
    }
    if (this.creationTimeSub) {
      this.creationTimeSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.sort.active = 'UserID';
    this.sort.direction = 'asc';
    this.generate(1000);
    this.pageSize = 5;
    this.expandedElement = null;
    this.rowExpanded = false;
    this.resolved = false;
    this.updateDisplayedColumns();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length >= 2 || filterValue === '') {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.dataSource.paginator = this.paginator;
  }

  clearFilter() {
    this.filterValue = '';
    this.dataSource.filter = '';
    this.resolved = false;
  }
  expandRow(record: Record): void {
    this.expandedElement = this.expandedElement === record ? null : record;
  }

  generate(count: number): void {
    const startTime = new Date().getTime();
    this.generationTimeLabel = '';
    this.roundtripLabel = '';

    this.generateNewRecordSub = this.recordService.generateNewRecordSet(count).subscribe((dataset: Record[]) => {
      if (dataset) {
        const endTime = new Date().getTime();
        const roundtrip = endTime - startTime;
        if (roundtrip > 1000) {
          this.roundtripLabel = parseFloat((roundtrip / 1000).toFixed(2)) + " seconds"
        } else {
          this.roundtripLabel = parseFloat(roundtrip.toFixed(2)) + " milliseconds"
        }

        this.dataset = dataset;
        this.resolved = false;

        this.creationTimeSub = this.recordService.getCreationTime().subscribe((generationTime: number) => {
          if (generationTime > 1000) {
            this.generationTimeLabel = parseFloat((generationTime / 1000).toFixed(2)) + " seconds"
          } else {
            this.generationTimeLabel = parseFloat(generationTime.toFixed(2)) + " milliseconds"
          }
        });
      }
    });
  }

  showDetailView(record: Record): void {
    this.recordService.setSelectedUID(record.UID);
    this.router.navigate(['record-detail', record.UID])
  }

  getTotalAnnualSalary(salary: Array<Company>): number {
    let total = 0;

    salary.forEach((company) => total += company.annualSalary);
    this.rowExpanded = !this.rowExpanded;

    return total;
  }
}