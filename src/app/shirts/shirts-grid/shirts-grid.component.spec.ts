import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShirtsGridComponent } from './shirts-grid.component';

describe('ShirtsGridComponent', () => {
  let component: ShirtsGridComponent;
  let fixture: ComponentFixture<ShirtsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShirtsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShirtsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
