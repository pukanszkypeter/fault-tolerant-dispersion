import { TestBed } from '@angular/core/testing';

import { AlgorithmEngineService } from './algorithm-engine.service';

describe('AlgorithmEngineService', () => {
  let service: AlgorithmEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlgorithmEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
