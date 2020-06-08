import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSubpanelComponent } from './profile-subpanel.component';

describe('ProfileSubpanelComponent', () => {
  let component: ProfileSubpanelComponent;
  let fixture: ComponentFixture<ProfileSubpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSubpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSubpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
