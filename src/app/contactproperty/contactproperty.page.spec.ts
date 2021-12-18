import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactpropertyPage } from './contactproperty.page';

describe('ContactpropertyPage', () => {
  let component: ContactpropertyPage;
  let fixture: ComponentFixture<ContactpropertyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactpropertyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactpropertyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
