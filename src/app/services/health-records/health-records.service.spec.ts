import { TestBed } from '@angular/core/testing';

import { HealthRecordsService } from './health-records.service';

describe('HealthRecordsService', () => {
  let service: HealthRecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthRecordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
