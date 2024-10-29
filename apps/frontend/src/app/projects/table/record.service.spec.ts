import { TestBed } from '@angular/core/testing';
import { RecordService } from './record.service';
import { HttpClientModule } from '@angular/common/http';
import { NotificationService } from '../../common/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { provideHttpClientTesting } from '@angular/common/http/testing';

const mockNotificationService = {
  // Add mock methods and properties as needed
  showSuccess: jest.fn(),
  showError: jest.fn(),
  success: jest.fn(),
  error: jest.fn()
};
describe('RecordServiceService', () => {
  let service: RecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        RecordService,
        { provide: NotificationService, useValue: mockNotificationService },
        ToastrService,
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(RecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
