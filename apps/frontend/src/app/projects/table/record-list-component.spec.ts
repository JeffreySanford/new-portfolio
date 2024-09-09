import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordListComponent } from './record-list-component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecordService } from './record.service';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Record } from './models/record';
import { Router } from '@angular/router';

describe('RecordListComponent', () => {
  let component: RecordListComponent;
  let fixture: ComponentFixture<RecordListComponent>;
  let recordService: RecordService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        HttpClientTestingModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [RecordListComponent],
      providers: [RecordService],
    }).compileComponents();

    // Mock the animate function
    if (!HTMLElement.prototype.animate) {
      HTMLElement.prototype.animate = jest.fn();
    }

    // Mock addEventListener to prevent errors
    if (!HTMLElement.prototype.addEventListener) {
      HTMLElement.prototype.addEventListener = jest.fn();
    }

    fixture = TestBed.createComponent(RecordListComponent);
    component = fixture.componentInstance;
    recordService = TestBed.inject(RecordService);
    router = TestBed.inject(Router);

    // Mock the recordService methods
    jest.spyOn(recordService, 'generateNewRecordSet').mockReturnValue(of([]));
    jest.spyOn(recordService, 'getCreationTime').mockReturnValue(of(1000));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Uncommented tests for completeness
  it('should call generateNewRecordSet on ngOnInit', () => {
    const generateNewRecordSetSpy = jest.spyOn(recordService, 'generateNewRecordSet');
    component.ngOnInit();
    expect(generateNewRecordSetSpy).toHaveBeenCalledWith(100); // Ensure the correct argument is passed
  });

  it('should update displayedColumns on window resize', () => {
    const updateDisplayedColumnsSpy = jest.spyOn(component as any, 'updateDisplayedColumns');
    window.dispatchEvent(new Event('resize'));
    expect(updateDisplayedColumnsSpy).toHaveBeenCalled();
  });

  it('should apply filter correctly', () => {
    const event = { target: { value: 'test' } } as unknown as Event;
    component.applyFilter(event);
    expect(component.dataSource.filter).toBe('test');
  });

  it('should clear filter correctly', () => {
    component.clearFilter();
    expect(component.filterValue).toBe('');
    expect(component.dataSource.filter).toBe('');
  });

  it('should expand row correctly', () => {
    const record = { UID: '1' } as Record;
    component.expandRow(record);
    expect(component.expandedElement).toBe(record);
    component.expandRow(record);
    expect(component.expandedElement).toBeNull();
  });

  it('should navigate to detail view correctly', () => {
    const routerSpy = jest.spyOn(router, 'navigate');
    const record = { UID: '1' } as Record;
    component.showDetailView(record);
    expect(routerSpy).toHaveBeenCalledWith(['record-detail', '1']);
  });
});