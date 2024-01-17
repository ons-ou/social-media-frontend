import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { friendsResolver } from './friends.resolver';

describe('friendsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => friendsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
