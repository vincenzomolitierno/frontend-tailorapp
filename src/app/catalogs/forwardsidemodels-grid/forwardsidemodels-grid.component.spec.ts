import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardsidemodelsGridComponent } from './forwardsidemodels-grid.component';

describe('ForwardsidemodelsGridComponent', () => {
  let component: ForwardsidemodelsGridComponent;
  let fixture: ComponentFixture<ForwardsidemodelsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForwardsidemodelsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardsidemodelsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
