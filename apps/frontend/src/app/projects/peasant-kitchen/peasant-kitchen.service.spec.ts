import { TestBed } from '@angular/core/testing';

import { PeasantKitchenService } from './peasant-kitchen.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PeasantKitchenService', () => {
  let service: PeasantKitchenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PeasantKitchenService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PeasantKitchenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
