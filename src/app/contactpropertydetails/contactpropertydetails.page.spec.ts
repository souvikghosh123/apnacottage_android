import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactpropertydetailsPage } from './contactpropertydetails.page';

describe('ContactpropertydetailsPage', () => {
  let component: ContactpropertydetailsPage;
  let fixture: ComponentFixture<ContactpropertydetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactpropertydetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactpropertydetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
