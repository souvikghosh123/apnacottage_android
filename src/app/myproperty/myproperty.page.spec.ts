import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MypropertyPage } from './myproperty.page';

describe('MypropertyPage', () => {
  let component: MypropertyPage;
  let fixture: ComponentFixture<MypropertyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MypropertyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MypropertyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
