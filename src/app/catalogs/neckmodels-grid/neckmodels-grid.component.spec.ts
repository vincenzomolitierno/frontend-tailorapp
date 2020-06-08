import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeckmodelsGridComponent } from './neckmodels-grid.component';

describe('NeckmodelsGridComponent', () => {
  let component: NeckmodelsGridComponent;
  let fixture: ComponentFixture<NeckmodelsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeckmodelsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeckmodelsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
