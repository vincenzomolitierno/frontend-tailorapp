import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DummySubpanelComponent } from './dummy-subpanel.component';

describe('DummySubpanelComponent', () => {
  let component: DummySubpanelComponent;
  let fixture: ComponentFixture<DummySubpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DummySubpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DummySubpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
