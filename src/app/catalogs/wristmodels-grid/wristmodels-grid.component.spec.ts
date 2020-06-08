import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WristmodelsGridComponent } from './wristmodels-grid.component';

describe('WristmodelsGridComponent', () => {
  let component: WristmodelsGridComponent;
  let fixture: ComponentFixture<WristmodelsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WristmodelsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WristmodelsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
