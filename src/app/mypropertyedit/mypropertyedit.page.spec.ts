import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MypropertyeditPage } from './mypropertyedit.page';

describe('MypropertyeditPage', () => {
  let component: MypropertyeditPage;
  let fixture: ComponentFixture<MypropertyeditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MypropertyeditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MypropertyeditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
