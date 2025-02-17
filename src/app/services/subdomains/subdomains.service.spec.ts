import { TestBed } from '@angular/core/testing';

import { SubdomainsService } from './subdomains.service';

describe('SubdomainsService', () => {
  let service: SubdomainsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubdomainsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
