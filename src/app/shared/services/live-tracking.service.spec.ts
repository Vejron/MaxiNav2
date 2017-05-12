import { TestBed, inject } from '@angular/core/testing';

import { LiveTrackingService } from './live-tracking.service';

describe('LiveTrackingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LiveTrackingService]
    });
  });

  it('should be created', inject([LiveTrackingService], (service: LiveTrackingService) => {
    expect(service).toBeTruthy();
  }));
});
