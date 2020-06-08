import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskSubpanelComponent } from './helpdesk-subpanel.component';

describe('HelpdeskSubpanelComponent', () => {
  let component: HelpdeskSubpanelComponent;
  let fixture: ComponentFixture<HelpdeskSubpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdeskSubpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskSubpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
