import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShowlistPage } from './showlist.page';

describe('ShowlistPage', () => {
  let component: ShowlistPage;
  let fixture: ComponentFixture<ShowlistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowlistPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShowlistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
