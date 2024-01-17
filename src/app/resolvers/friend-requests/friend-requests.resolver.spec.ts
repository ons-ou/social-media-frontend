import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { friendRequestsResolver } from './friend-requests.resolver';

describe('friendRequestsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => friendRequestsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
