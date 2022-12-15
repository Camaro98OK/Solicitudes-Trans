import { TestBed } from '@angular/core/testing';

import { DbDatosService } from './db-datos.service';

describe('DbDatosService', () => {
  let service: DbDatosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbDatosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
