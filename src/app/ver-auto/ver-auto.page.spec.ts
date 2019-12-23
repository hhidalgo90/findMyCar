import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerAutoPage } from './ver-auto.page';

describe('VerAutoPage', () => {
  let component: VerAutoPage;
  let fixture: ComponentFixture<VerAutoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerAutoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerAutoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
