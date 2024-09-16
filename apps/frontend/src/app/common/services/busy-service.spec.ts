import { TestBed } from '@angular/core/testing';
import { BusyService } from './busy.service';

describe('BusyServiceService', () => {
  let service: BusyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusyService]
    });
    service = TestBed.inject(BusyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
