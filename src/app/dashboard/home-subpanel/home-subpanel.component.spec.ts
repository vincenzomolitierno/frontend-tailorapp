import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSubpanelComponent } from './home-subpanel.component';

describe('HomeSubpanelComponent', () => {
  let component: HomeSubpanelComponent;
  let fixture: ComponentFixture<HomeSubpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeSubpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSubpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
