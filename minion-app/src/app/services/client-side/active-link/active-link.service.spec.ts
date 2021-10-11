import { TestBed } from '@angular/core/testing';

import { ActiveLinkService } from './active-link.service';

describe('ActiveLinkService', () => {
  let service: ActiveLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
