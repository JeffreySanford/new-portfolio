import { AfterContentChecked, AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { Record } from './models/record';
import { Company } from './models/company';
import { RecordService } from './record.service';
import { Subject, BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { switchMap, tap } from 'rxjs/operators';
import { detailExpand, flyIn } from './animations';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list-component.html',
  styleUrls: ['./record-list-component.scss'],
  animations: [detailExpand, flyIn]
})

export class RecordListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  rowExpanded = false;
  filterValue = '';
  dataSetSizes = [1000, 15000, 100000, 1000000];
  pageSizeOptions = [10, 25, 100, 1000, 10000];
  resolved = false;
  time?: Date;
  expandedElement?: Record | null;
  dataSource = new MatTableDataSource<Record>([]);
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
  showAddressColumns = true;
  showMediumColumns = true;

  private resolvedSubject = new BehaviorSubject<boolean>(true);
  resolved$ = this.resolvedSubject.asObservable();
  totalRecords = 0;
  pageIndex = 0;
  pageSize = 10;
  length = 0;

  constructor(private router: Router, private recordService: RecordService, private changeDetectorRef: ChangeDetectorRef) {
    console.log('Step 0: RecordListComponent constructor called');
    // Subscribe to resolved state changes if needed
    this.resolved$.subscribe(resolved => {
      if (resolved) {
        console.log('Resolved state is true');
      } else {
        console.log('Resolved state is false');
      }
      console.log('Resolved state changed:', resolved);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    console.log('Step 1: onResize called. Event:', event);
    this.updateDisplayedColumns();
  }

  sortData(event: Sort): void {
    console.log('Step 2: sortData called with event:', event);
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    console.log('Step 3: applyFilter called with event:', event);
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length >= 2 || filterValue === '') {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      console.log('Step 3: Filter applied with value:', filterValue);
    }
  }

  onDisplayRowChange(event: MatPaginator): void {
    console.log('Step 4: onDisplayRowChange called with event:', event);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.pageIndex = event.pageIndex;
      this.dataSource.paginator.pageSize = event.pageSize;
      this.dataSource.paginator.length = event.length;
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.length = event.length;

      console.log('Step 4: Paginator updated with pageIndex:', event.pageIndex, 'pageSize:', event.pageSize, 'length:', event.length);
    }
  }

  ngOnInit(): void {
    console.log('Step 5: ngOnInit called');
    this.resolved = false;
    this.recordService.generateNewRecordSet(5).pipe(takeUntil(this.destroy$)).subscribe(
      (records) => {
        console.log('Step 5: Records fetched:', records);
        this.dataSource.data = records;
        // create MatPaginatorIntl instance
        const customPaginatorIntl = new MatPaginatorIntl();
        customPaginatorIntl.itemsPerPageLabel = 'Records per page:';
        customPaginatorIntl.nextPageLabel = 'Next page';
        customPaginatorIntl.previousPageLabel = 'Previous page';
        customPaginatorIntl.firstPageLabel = 'First page';
        customPaginatorIntl.lastPageLabel = 'Last page';
        customPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
          if (length === 0 || pageSize === 0) { return `0 of ${length}`; }
          length = Math.max(length, 0);
          const startIndex = page * pageSize;
          const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
          return `${startIndex + 1} – ${endIndex} of ${length}`;
        };

        this.paginator = new MatPaginator(customPaginatorIntl, this.changeDetectorRef);
        this.paginator.pageSizeOptions = [10, 25, 100, 1000, 10000];
        this.paginator.pageIndex = this.pageIndex;
        this.paginator.pageSize = this.pageSize;
        this.paginator.length = this.length;
        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = new MatSort();
        this.dataSource.sort.active = 'userID';
        this.dataSource.sort.direction = 'asc';
        this.resolved = true;
        this.dataSource.filterPredicate = (data: Record, filter: string) => {
          return data.UID.toLowerCase().includes(filter);
        };
        console.log('Step 5: Data source initialized and resolved');
      },
      (error) => {
        console.error('Step 5: Error fetching records:', error);
        this.resolved = false;
      }
    );
  }

  ngAfterViewInit(): void {
    // Assign the paginator instance to the dataSource
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    console.log('Step 6: ngOnDestroy called');
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateDisplayedColumns(): void {
    console.log('Step 7: updateDisplayedColumns called');
    const width = window.innerWidth;
    if (width < 1000) {
      this.displayedColumns = ['userID', 'name', 'icons'];
      console.log('Step 7.1: Width < 1000, displayedColumns updated to:', this.displayedColumns);
    } else if (width < 1200) {
      this.displayedColumns = ['userID', 'name', 'state', 'zip', 'icons'];
      console.log('Step 7.2: Width < 1200, displayedColumns updated to:', this.displayedColumns);
    } else if (width < 1400) {
      this.displayedColumns = ['userID', 'name', 'city', 'state', 'zip', 'icons'];
      console.log('Step 7.3: Width < 1400, displayedColumns updated to:', this.displayedColumns);
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
      console.log('Step 7.4: Width >= 1400, displayedColumns updated to:', this.displayedColumns);
    }
  }

  onDatasetChange(count: number): void {
    this.resolved = false;
    console.log('Step 8: onDatasetChange called with count:', count);
    this.resolvedSubject.next(false); // Set resolved to false before generating new data
    console.log('Step 8.1: resolvedSubject set to false');

    this.recordService.generateNewRecordSet(count).pipe(takeUntil(this.destroy$)).subscribe(
      (records) => {
        console.log('Step 8.2: New records generated:', records);
        this.dataSource.data = records;
        this.resolvedSubject.next(true); // Set resolved to true after data generation is complete
        this.resolved = true;
        console.log('Step 8.3: Data generation completed for dataset change, resolved set to true');
      },
      (error) => {
        console.error('Step 8.4: Error generating new records:', error);
        this.resolvedSubject.next(true); // Ensure resolved is set to true even on error
        console.log('Step 8.5: resolvedSubject set to true due to error');
      }
    );
  }

  clearFilter(): void {
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
              this.resolvedSubject.next(true);
              console.log('Step 11: Data generation and timing labels updated');
            }),
            catchError((error) => {
              console.error('Error in getCreationTime:', error);
              this.resolvedSubject.next(true);
              return of('');
            })
          );
        }
        return of('');
      }),
      catchError((error) => {
        console.error('Error in generateNewRecordSet:', error);
        this.resolvedSubject.next(true);
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