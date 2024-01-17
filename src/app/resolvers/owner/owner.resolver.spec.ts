import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { ownerResolver } from './owner.resolver';

describe('ownerResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => ownerResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
