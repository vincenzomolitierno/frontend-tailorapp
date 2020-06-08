import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcontractorFormComponent } from './subcontractor-form.component';

describe('SubcontractorFormComponent', () => {
  let component: SubcontractorFormComponent;
  let fixture: ComponentFixture<SubcontractorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcontractorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcontractorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
