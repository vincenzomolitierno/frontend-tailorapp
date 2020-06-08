import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BacksidemodelsGridComponent } from './backsidemodels-grid.component';

describe('BacksidemodelsGridComponent', () => {
  let component: BacksidemodelsGridComponent;
  let fixture: ComponentFixture<BacksidemodelsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BacksidemodelsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BacksidemodelsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
