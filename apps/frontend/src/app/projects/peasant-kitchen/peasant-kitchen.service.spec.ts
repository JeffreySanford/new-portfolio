import { TestBed } from '@angular/core/testing';

import { PeasantKitchenService } from './peasant-kitchen.service';

describe('PeasantKitchenService', () => {
  let service: PeasantKitchenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeasantKitchenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
