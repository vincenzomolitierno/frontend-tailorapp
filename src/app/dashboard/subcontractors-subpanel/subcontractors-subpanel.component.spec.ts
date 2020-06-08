import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcontractorsSubpanelComponent } from './subcontractors-subpanel.component';

describe('SubcontractorsSubpanelComponent', () => {
  let component: SubcontractorsSubpanelComponent;
  let fixture: ComponentFixture<SubcontractorsSubpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcontractorsSubpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcontractorsSubpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
