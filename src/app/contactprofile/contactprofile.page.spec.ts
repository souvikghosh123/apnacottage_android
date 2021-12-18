import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ContactprofilePage } from './contactprofile.page';

describe('ContactprofilePage', () => {
  let component: ContactprofilePage;
  let fixture: ComponentFixture<ContactprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactprofilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ContactprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
