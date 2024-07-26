import { TestBed } from '@angular/core/testing';

import { TimelineDataService } from './timeline-data.service';

describe('TimelineDataService', () => {
  let service: TimelineDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelineDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
