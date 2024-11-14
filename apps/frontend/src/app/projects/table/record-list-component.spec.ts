import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordListComponent } from './record-list-component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../../material.module';
import { HttpClientTestingModule, provideHttpClientTesting } from '@angular/common/http/testing';
import { RecordService } from './record.service';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../common/services/notification.service';
import { RouterModule, Router } from '@angular/router';
import { appRoutes } from '../../app.routes';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

describe('RecordListComponent', () => {
  let component: RecordListComponent;
  let fixture: ComponentFixture<RecordListComponent>;
  let mockNotificationService: Partial<NotificationService>;
  let router: Router;

  beforeEach(async () => {
    mockNotificationService = {
      clear: jest.fn(),
      showSuccess: jest.fn(),
      showError: jest.fn(),
      showHTMLMessage: jest.fn()
    };

    Object.defineProperty(HTMLElement.prototype, 'animate', {
      configurable: true,
      value: jest.fn()
    });

    const mockElement = document.createElement('div');
    mockElement.id = 'mockElementId';
    document.body.appendChild(mockElement);

    jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);
    jest.spyOn(window, 'addEventListener').mockImplementation(() => {
      console.log('addEventListener');
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(appRoutes),
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        MatPaginatorModule,
        MatSortModule,
        HttpClientTestingModule,
        ToastrModule.forRoot({
          timeOut: 3000,
          positionClass: 'toast-bottom-center',
          preventDuplicates: true,
        })
      ],
      declarations: [RecordListComponent],
      providers: [
        RecordService,
        { provide: NotificationService, useValue: mockNotificationService },
        ToastrService,
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RecordListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.body.removeChild(document.getElementById('mockElementId')!);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
