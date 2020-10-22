import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubirImagenPerfilPage } from './subir-imagen-perfil.page';

describe('SubirImagenPerfilPage', () => {
  let component: SubirImagenPerfilPage;
  let fixture: ComponentFixture<SubirImagenPerfilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirImagenPerfilPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubirImagenPerfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
