import { TestBed } from '@angular/core/testing';

import { GraphGeneratorService } from './graph-generator.service';

describe('GraphGeneratorService', () => {
  let service: GraphGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
