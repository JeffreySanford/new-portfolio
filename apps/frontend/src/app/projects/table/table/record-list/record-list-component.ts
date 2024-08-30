import { AfterContentChecked, AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { Record } from '../models/record';
import { Company } from '../models/company';
import { RecordService } from './record.service';
import { Subject, BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list-component.html',
  styleUrls: ['./record-list-component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('flyIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('1s ease-in-out', style({ transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class RecordListComponent implements OnInit, AfterContentChecked, AfterViewInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  rowExpanded = false;
  totalRecords = 0;
  filterValue = '';
  pageSizeOptions = [5, 25, 100, 1000];
  dataSetSizes = [5, 15000, 100000, 1000000];
  resolved = false;
  time?: Date;
  expandedElement?: Record | null;
  dataSource = new MatTableDataSource<Record>([]);
  pageSize = 5;
  startTime?: () => number;
  generationTimeLabel = '';
  roundtripLabel = '';
  showMinimalColumns = false;

  displayedColumns: string[] = [
    'userID',
    'name',
    'address',
    'city',
    'state',
    'zip',
    'phone',
    'icons',
  ];
  private destroy$ = new Subject<void>();
  dataset: Record[] = [];
  showAddressColumns = true;
  showMediumColumns = true;

  private resolvedSubject = new BehaviorSubject<boolean>(true);
  resolved$ = this.resolvedSubject.asObservable();

  constructor(private router: Router, private recordService: RecordService) {
    // Subscribe to resolved state changes if needed
    this.resolved$.subscribe(resolved => {
      console.log('Resolved state changed:', resolved);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    console.log('Step 1: onResize called');
    this.updateDisplayedColumns();
  }

  sortData(event: any): void {
    console.log('Step 2: sortData called with event:', event);
    this.sort.active = event.active;
    this.sort.direction = event.direction;
    this.dataSource.sort = this.sort;
  }

  updateDisplayedColumns(): void {
    console.log('Step 3: updateDisplayedColumns called');
    const width = window.innerWidth;
    if (width < 1000) {
      this.displayedColumns = ['userID', 'name', 'icons'];
    } else if (width < 1200) {
      this.displayedColumns = ['userID', 'name', 'state', 'zip', 'icons'];
    } else if (width < 1400) {
      this.displayedColumns = ['userID', 'name', 'city', 'state', 'zip', 'icons'];
    } else {
      this.displayedColumns = [
        'userID',
        'name',
        'address',
        'city',
        'state',
        'zip',
        'phone',
        'icons',
      ];
    }
    console.log('Step 3: displayedColumns updated to:', this.displayedColumns);
  }

  ngAfterContentChecked() {
    console.log('Step 4: ngAfterContentChecked called: resolved:', this.resolved, 'dataset:', this.dataset.length);
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
      console.log('Step 4: Data source and columns updated. resolved:', this.resolved);
    }
  }

  ngOnDestroy(): void {
    console.log('Step 5: ngOnDestroy called');
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    console.log('Step 6: ngOnInit called');

    this.recordService.generateNewRecordSet(5).subscribe(
      (records) => {
        console.log('Step 6: Records fetched:', records);
        this.dataSource = new MatTableDataSource(records);
        this.dataSource.paginator = this.paginator;
        
        this.dataSource.sort = new MatSort(this.sort);
        this.sort.active = 'userID';
        this.sort.direction = 'asc';
        
        this.pageSize = 5;
        this.expandedElement = null;
        this.rowExpanded = false;
        this.updateDisplayedColumns();
        this.resolvedSubject.next(true);
        console.log('Step 6: Component initialized and resolved');
      },
      (error) => {
        console.error('Step 6: Error fetching records:', error);
        this.resolvedSubject.next(true);
      }
    );
  }

  ngAfterViewInit(): void {
    console.log('Step 6.1: ngAfterViewInit called');
    this.dataSource.sort = this.sort; // Ensure the sort is assigned after view initialization
    console.log('Step 6.1: Sort initialized:', this.sort);
  }

  applyFilter(event: Event) {
    console.log('Step 7: applyFilter called with event:', event);
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length >= 2 || filterValue === '') {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      console.log('Step 7: Filter applied with value:', filterValue);
    }
  }

  onPageChange(count: number) {
    console.log('Step 8: onPageChange called with count:', count);
    this.resolvedSubject.next(false); // Set resolved to false before generating new data
    this.generate(count).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.resolvedSubject.next(true); // Set resolved to true after data generation is complete
      console.log('Step 8: Data generation completed for page change');
    });
  }

  clearFilter() {
    console.log('Step 9: clearFilter called');
    this.filterValue = '';
    this.dataSource.filter = '';
    this.resolved = false;
    console.log('Step 9: Filter cleared');
  }

  expandRow(record: Record): void {
    console.log('Step 10: expandRow called with record:', record);
    this.expandedElement = this.expandedElement === record ? null : record;
    console.log('Step 10: Row expanded state updated');
  }

  generate(count: number): Observable<string> {
    console.log('Step 11: generate called with count:', count);
    this.dataSource.data = [];
    const startTime = new Date().getTime();
    this.generationTimeLabel = '';
    this.roundtripLabel = '';

    return this.recordService.generateNewRecordSet(count).pipe(
      switchMap((dataset: Record[]) => {
        if (dataset) {
          console.log('Step 11: Generated ' + dataset.length + ' records');
          const endTime = new Date().getTime();
          const roundtrip = endTime - startTime;
          if (roundtrip > 1000) {
            this.roundtripLabel = parseFloat((roundtrip / 1000).toFixed(2)) + ' seconds';
          } else {
            this.roundtripLabel = parseFloat(roundtrip.toFixed(2)) + ' milliseconds';
          }

          return this.recordService.getCreationTime().pipe(
            switchMap((generationTime: number) => {
              if (generationTime > 1000) {
                this.generationTimeLabel = parseFloat((generationTime / 1000).toFixed(2)) + ' seconds';
              } else {
                this.generationTimeLabel = parseFloat(generationTime.toFixed(2)) + ' milliseconds';
              }

              return of(this.generationTimeLabel);
            }),
            tap(() => {
              this.resolvedSubject.next(false);
              console.log('Step 11: Data generation and timing labels updated');
            }),
            catchError((error) => {
              console.error('Error in getCreationTime:', error);
              return of('');
            })
          );
        }
        return of('');
      }),
      catchError((error) => {
        console.error('Error in generateNewRecordSet:', error);
        return of('');
      })
    );
  }

  showDetailView(record: Record): void {
    console.log('Step 12: showDetailView called with record:', record);
    this.recordService.setSelectedUID(record.UID);
    this.router.navigate(['record-detail', record.UID]);
    console.log('Step 12: Navigated to record detail view');
  }

  getTotalAnnualSalary(salary: Array<Company>): number {
    console.log('Step 13: getTotalAnnualSalary called with salary:', salary);
    let total = 0;
    salary.forEach((company) => (total += company.annualSalary));
    this.rowExpanded = !this.rowExpanded;
    console.log('Step 13: Total annual salary calculated:', total);
    return total;
  }
}