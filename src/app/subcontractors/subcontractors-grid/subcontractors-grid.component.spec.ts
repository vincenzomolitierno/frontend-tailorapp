import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcontractorsGridComponent } from './subcontractors-grid.component';

describe('SubcontractorsGridComponent', () => {
  let component: SubcontractorsGridComponent;
  let fixture: ComponentFixture<SubcontractorsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcontractorsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcontractorsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
