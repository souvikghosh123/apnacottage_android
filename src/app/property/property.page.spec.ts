import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PropertyPage } from './property.page';

describe('PropertyPage', () => {
  let component: PropertyPage;
  let fixture: ComponentFixture<PropertyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PropertyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
