import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MenuUsuarioLogueadoPage } from './menu-usuario-logueado.page';

describe('MenuUsuarioLogueadoPage', () => {
  let component: MenuUsuarioLogueadoPage;
  let fixture: ComponentFixture<MenuUsuarioLogueadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuUsuarioLogueadoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuUsuarioLogueadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
