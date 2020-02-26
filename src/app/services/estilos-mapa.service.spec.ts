import { TestBed } from '@angular/core/testing';

import { EstilosMapaService } from './estilos-mapa.service';

describe('EstilosMapaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EstilosMapaService = TestBed.get(EstilosMapaService);
    expect(service).toBeTruthy();
  });
});
