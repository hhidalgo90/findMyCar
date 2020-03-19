import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HistorialEstacionamientosPage } from './historial-estacionamientos.page';

describe('HistorialEstacionamientosPage', () => {
  let component: HistorialEstacionamientosPage;
  let fixture: ComponentFixture<HistorialEstacionamientosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialEstacionamientosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialEstacionamientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
