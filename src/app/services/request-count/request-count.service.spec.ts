import { TestBed } from '@angular/core/testing';

import { RequestCountService } from './request-count.service';

describe('RequestCountService', () => {
  let service: RequestCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
