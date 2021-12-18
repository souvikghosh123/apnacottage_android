import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileeditPage } from './profileedit.page';

describe('ProfileeditPage', () => {
  let component: ProfileeditPage;
  let fixture: ComponentFixture<ProfileeditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileeditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileeditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
