import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MypropertyviewPage } from './mypropertyview.page';

describe('MypropertyviewPage', () => {
  let component: MypropertyviewPage;
  let fixture: ComponentFixture<MypropertyviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MypropertyviewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MypropertyviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
