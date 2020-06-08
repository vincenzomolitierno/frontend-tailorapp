import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShirtMarksComponent } from './shirt-marks.component';

describe('ShirtMarksComponent', () => {
  let component: ShirtMarksComponent;
  let fixture: ComponentFixture<ShirtMarksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShirtMarksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShirtMarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
