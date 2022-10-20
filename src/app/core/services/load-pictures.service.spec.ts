import { TestBed } from '@angular/core/testing';

import { LoadPicturesService } from './load-pictures.service';

describe('LoadPicturesService', () => {
  let service: LoadPicturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadPicturesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
