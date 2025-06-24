import { TestBed } from '@angular/core/testing';

import { UserTypeGuard } from './user-type.guard';

describe('UserTypeService', () => {
  let service: UserTypeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTypeGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
