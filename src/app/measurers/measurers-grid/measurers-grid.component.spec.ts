import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasurersGridComponent } from './measurers-grid.component';

describe('MeasurersGridComponent', () => {
  let component: MeasurersGridComponent;
  let fixture: ComponentFixture<MeasurersGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeasurersGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeasurersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
