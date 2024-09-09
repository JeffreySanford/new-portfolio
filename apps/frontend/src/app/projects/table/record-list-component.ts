import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Record } from './models/record';
import { RecordService } from './record.service';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { catchError, switchMap, tap, takeUntil } from 'rxjs/operators';
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
  dataSetSizes = [1000, 15000, 100000, 750000];
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
  totalRecords = 100;
  newData = false;

  constructor(private router: Router, private recordService: RecordService, private changeDetectorRef: ChangeDetectorRef) {
    console.log('Constructor: RecordListComponent initialized');
    this.resolved$.subscribe(resolved => {
      console.log('Subscription: Resolved state changed:', resolved);
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    console.log('Event: Window resized');
    this.updateDisplayedColumns();
  }

  sortData(event: Sort): void {
    console.log('Event: Data sorted with event:', event);
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    console.log('Event: Filter applied with event:', event);
    const filterValue = (event.target as HTMLInputElement).value;
    if (filterValue.length >= 2 || filterValue === '') {
      this.dataSource.filter = filterValue.trim().toLowerCase();
      console.log('Filter: Applied with value:', filterValue);
    }
  }

  onDisplayRowChange(event: MatPaginator): void {
    console.log('Event: Display row change with event:', event);
    if (this.paginator) {
      this.paginator.pageIndex = event.pageIndex;
      this.paginator.pageSize = event.pageSize;
      this.paginator.length = event.length;
      console.log('Paginator: Updated with pageIndex:', event.pageIndex, 'pageSize:', event.pageSize, 'length:', event.length);
    }
  }

  ngOnInit(): void {
    console.log('Lifecycle: ngOnInit called');
    this.resolved = false;
    this.recordService.generateNewRecordSet(100).pipe(
      takeUntil(this.destroy$),
      switchMap((dataset: Record[]) => {
        if (dataset) {
          this.dataSource.data = dataset;
          this.totalRecords = dataset.length;
          this.resolved = true;
          this.newData = true;
          this.changeDetectorRef.detectChanges(); // Notify Angular of changes

          console.log('Data: New record set generated with length:', dataset.length);

          this.updateCreationTime();
        }
        return of([]);
      }),
      catchError((error) => {
        console.error('Error: generateNewRecordSet failed:', error);
        this.resolvedSubject.next(true);
        this.changeDetectorRef.detectChanges(); // Notify Angular of changes
        return of([]);
      })
    ).subscribe();
  }

  ngAfterContentChecked(): void {
    if (this.resolved && this.dataSource.data.length > 0 && this.newData) {
      console.log('Lifecycle: ngAfterContentChecked called');
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
    console.log('Lifecycle: ngAfterViewInit called');
  }

  ngOnDestroy(): void {
    console.log('Lifecycle: ngOnDestroy called');
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateDisplayedColumns(): void {
    console.log('Method: updateDisplayedColumns called');
    const width = window.innerWidth;
    if (width < 1000) {
      this.displayedColumns = ['userID', 'name', 'icons'];
      console.log('Displayed Columns: Width < 1000, updated to:', this.displayedColumns);
    } else if (width < 1200) {
      this.displayedColumns = ['userID', 'name', 'state', 'zip', 'icons'];
      console.log('Displayed Columns: Width < 1200, updated to:', this.displayedColumns);
    } else if (width < 1400) {
      this.displayedColumns = ['userID', 'name', 'city', 'state', 'zip', 'icons'];
      console.log('Displayed Columns: Width < 1400, updated to:', this.displayedColumns);
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
      console.log('Displayed Columns: Width >= 1400, updated to:', this.displayedColumns);
    }
  }

  onDatasetChange(count: number): void {
    this.resolved = false;
    console.log('Event: Dataset change requested with count:', count);
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
          this.changeDetectorRef.detectChanges(); // Notify Angular of changes

          this.totalRecords = dataset.length;
          console.log('Data: New record set generated with length:', dataset.length);

          this.updateCreationTime();
        }
        return of([]);
      }),
      catchError((error) => {
        console.error('Error: generateNewRecordSet failed:', error);
        this.resolvedSubject.next(true);
        this.changeDetectorRef.detectChanges(); // Notify Angular of changes
        return of([]);
      })
    ).subscribe();
  }

  clearFilter(): void {
    console.log('Event: Clear filter requested');
    this.filterValue = '';
    this.dataSource.filter = '';
    this.resolved = false;
    console.log('Filter: Cleared');
  }

  expandRow(record: Record): void {
      console.log('Event: Row expand requested for record:', record);
      this.expandedElement = this.expandedElement?.UID === record.UID ? null : record;
      console.log('Row: Expanded state updated');
  }

  showDetailView(record: Record): void {
    console.log('Event: Show detail view requested for record:', record);
    this.recordService.setSelectedUID(record.UID);
    this.router.navigate(['record-detail', record.UID]);
    console.log('Navigation: Navigated to record detail view');
  }

  private updateCreationTime(): void {
    const startTime = new Date().getTime();
    this.recordService.getCreationTime().pipe(
      takeUntil(this.destroy$),
      tap((generationTime: number) => {
        const endTime = new Date().getTime();
        const roundtrip = endTime - startTime;
        this.roundtripLabel = roundtrip > 1000 ? `${(roundtrip / 1000).toFixed(2)} seconds` : `${roundtrip.toFixed(2)} milliseconds`;
        this.generationTimeLabel = generationTime > 1000 ? `${(generationTime / 1000).toFixed(2)} seconds` : `${generationTime.toFixed(2)} milliseconds`;
        console.log('Timing: Data generation and roundtrip time updated:', this.generationTimeLabel, this.roundtripLabel);
        this.resolvedSubject.next(true);
        this.changeDetectorRef.detectChanges(); // Notify Angular of changes
      }),
      catchError((error) => {
        console.error('Error: getCreationTime failed:', error);
        this.resolvedSubject.next(true);
        this.changeDetectorRef.detectChanges();
        return of('');
      })
    ).subscribe();
  }
}