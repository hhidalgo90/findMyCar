import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalComoLlegarPage } from './modal-como-llegar.page';

describe('ModalComoLlegarPage', () => {
  let component: ModalComoLlegarPage;
  let fixture: ComponentFixture<ModalComoLlegarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComoLlegarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComoLlegarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
