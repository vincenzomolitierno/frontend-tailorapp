import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuFormComponent } from './cu-form.component';

describe('CuFormComponent', () => {
  let component: CuFormComponent;
  let fixture: ComponentFixture<CuFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
