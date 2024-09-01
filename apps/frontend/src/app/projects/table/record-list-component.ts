import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Record } from './models/record';
import { RecordService } from './record.service';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { switchMap, tap, takeUntil } from 'rxjs/operators';
import { detailExpand, flyIn } from './animations';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list-component.html',
  styleUrls: ['./record-list-component.scss'],
  animations: [detailExpand, flyIn]
})
export class RecordListComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked {
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  rowExpanded = false;
  filterValue = '';
  dataSetSizes = [1000, 15000, 100000, 1000000];
  resolved = false;
  time?: Date;
  expandedElement?: Record | null;
  dataSource = new MatTableDataSource<Record>([]);
  startTime?: () => number;
  generationTimeLabel = '';
  roundtripLabel = '';
  showAddressColumns = true;
  showMediumColumns = true;
  showMinimalColumns = false;
  displayedColumns: string[] = ['userID', 'name', 'address', 'city', 'state', 'zip', 'phone', 'icons'];
  private destroy$ = new Subject<void>();
  private resolvedSubject = new BehaviorSubject<boolean>(true);
  resolved$ = this.resolvedSubject.asObservable();
  totalRecords = 0;
  newData = false;

  constructor(private router: Router, private recordService: RecordService, private changeDetectorRef: ChangeDetectorRef) {
    console.log('Step 0: RecordListComponent constructor called');
    this.resolved$.subscribe(resolved => {
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
    if (this.paginator) {
      this.paginator.pageIndex = event.pageIndex;
      this.paginator.pageSize = event.pageSize;
      this.paginator.length = event.length;
      console.log('Step 4: Paginator updated with pageIndex:', event.pageIndex, 'pageSize:', event.pageSize, 'length:', event.length);
    }
  }

  ngOnInit(): void {
    console.log('Step 5: ngOnInit called');
    this.resolved = false;
    this.recordService.generateNewRecordSet(1000).pipe(
      takeUntil(this.destroy$),
      switchMap((dataset: Record[]) => {
        if (dataset) {
          this.dataSource.data = dataset;
          this.resolved = true;
          this.newData = true;
          this.changeDetectorRef.detectChanges();

          this.totalRecords = dataset.length;
          console.log('Step 6: Data generated:', dataset.length);

          const startTime = new Date().getTime();
          this.recordService.getCreationTime().pipe(
            takeUntil(this.destroy$),
            tap((generationTime: number) => {
              const endTime = new Date().getTime();
              const roundtrip = endTime - startTime;
              this.roundtripLabel = roundtrip > 1000 ? `${(roundtrip / 1000).toFixed(2)} seconds` : `${roundtrip.toFixed(2)} milliseconds`;
              this.generationTimeLabel = generationTime > 1000 ? `${(generationTime / 1000).toFixed(2)} seconds` : `${generationTime.toFixed(2)} milliseconds`;
              console.log('Step 7: Data generation and timing labels updated:', this.generationTimeLabel, this.roundtripLabel);
              this.resolvedSubject.next(true);
            }),
            catchError((error) => {
              console.error('Error in getCreationTime:', error);
              this.resolvedSubject.next(true);
              return of('');
            })
          ).subscribe();
        }
        return of([]);
      }),
      catchError((error) => {
        console.error('Error in generateNewRecordSet:', error);
        this.resolvedSubject.next(true);
        return of([]);
      })
    ).subscribe();
  }

  ngAfterContentChecked(): void {
    if (this.resolved && this.dataSource.data.length > 0 && this.newData) {
      console.log('Step 8: ngAfterContentChecked called');
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = 5;
      this.paginator.length = this.totalRecords;
      this.paginator.pageSizeOptions = [5, 25, 100, 6000, 48000];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data: Record, filter: string) => {
        return data.UID.toLowerCase().includes(filter);
      };

      this.sort = { active: 'userID', direction: 'asc' } as MatSort;
      this.updateDisplayedColumns();
      this.changeDetectorRef.detectChanges();
      this.newData = false;
    }
  }

  ngAfterViewInit(): void {
    console.log('Step 9: ngAfterViewInit called');
  }

  ngOnDestroy(): void {
    console.log('Step 10: ngOnDestroy called');
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateDisplayedColumns(): void {
    console.log('Step 11: updateDisplayedColumns called');
    const width = window.innerWidth;
    if (width < 1000) {
      this.displayedColumns = ['userID', 'name', 'icons'];
      console.log('Step 11.1: Width < 1000, displayedColumns updated to:', this.displayedColumns);
    } else if (width < 1200) {
      this.displayedColumns = ['userID', 'name', 'state', 'zip', 'icons'];
      console.log('Step 11.2: Width < 1200, displayedColumns updated to:', this.displayedColumns);
    } else if (width < 1400) {
      this.displayedColumns = ['userID', 'name', 'city', 'state', 'zip', 'icons'];
      console.log('Step 11.3: Width < 1400, displayedColumns updated to:', this.displayedColumns);
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
      console.log('Step 11.4: Width >= 1400, displayedColumns updated to:', this.displayedColumns);
    }
  }

  onDatasetChange(count: number): void {
    this.resolved = false;
    console.log('Step 12: onDatasetChange called with count:', count);
    this.recordService.generateNewRecordSet(count).pipe(
      takeUntil(this.destroy$),
      switchMap((dataset: Record[]) => {
        if (dataset) {
          this.dataSource.data = dataset;
          this.resolved = true;
          this.newData = true;

          this.paginator.pageIndex = 0;
          this.paginator.pageSize = 5;
          this.paginator.length = dataset.length;

          this.dataSource.filterPredicate = (data: Record, filter: string) => {
            return data.UID.toLowerCase().includes(filter);
          };
    
          this.sort = { active: 'userID', direction: 'asc' } as MatSort;
          this.updateDisplayedColumns();
          this.changeDetectorRef.detectChanges();

          this.totalRecords = dataset.length;
          console.log('Step 13: Data generated:', dataset.length);

          const startTime = new Date().getTime();
          this.recordService.getCreationTime().pipe(
            takeUntil(this.destroy$),
            tap((generationTime: number) => {
              const endTime = new Date().getTime();
              const roundtrip = endTime - startTime;
              this.roundtripLabel = roundtrip > 1000 ? `${(roundtrip / 1000).toFixed(2)} seconds` : `${roundtrip.toFixed(2)} milliseconds`;
              this.generationTimeLabel = generationTime > 1000 ? `${(generationTime / 1000).toFixed(2)} seconds` : `${generationTime.toFixed(2)} milliseconds`;
              console.log('Step 14: Data generation and timing labels updated:', this.generationTimeLabel, this.roundtripLabel);
              this.resolvedSubject.next(true);
            }),
            catchError((error) => {
              console.error('Error in getCreationTime:', error);
              this.resolvedSubject.next(true);
              return of('');
            })
          ).subscribe();
        }
        return of([]);
      }),
      catchError((error) => {
        console.error('Error in generateNewRecordSet:', error);
        this.resolvedSubject.next(true);
        return of([]);
      })
    ).subscribe();
  }

  clearFilter(): void {
    console.log('Step 15: clearFilter called');
    this.filterValue = '';
    this.dataSource.filter = '';
    this.resolved = false;
    console.log('Step 15: Filter cleared');
  }

  expandRow(record: Record): void {
    console.log('Step 16: expandRow called with record:', record);
    this.expandedElement = this.expandedElement === record ? null : record;
    console.log('Step 16: Row expanded state updated');
  }

  showDetailView(record: Record): void {
    console.log('Step 17: showDetailView called with record:', record);
    this.recordService.setSelectedUID(record.UID);
    this.router.navigate(['record-detail', record.UID]);
    console.log('Step 17: Navigated to record detail view');
  }
}