import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurerFormComponent } from './measurer-form.component';

describe('MeasurerFormComponent', () => {
  let component: MeasurerFormComponent;
  let fixture: ComponentFixture<MeasurerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasurerFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
