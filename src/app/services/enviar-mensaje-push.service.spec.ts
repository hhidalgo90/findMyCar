import { TestBed } from '@angular/core/testing';

import { EnviarMensajePushService } from './enviar-mensaje-push.service';

describe('EnviarMensajePushService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnviarMensajePushService = TestBed.get(EnviarMensajePushService);
    expect(service).toBeTruthy();
  });
});
