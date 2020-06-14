import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersUndeliveredGridComponent } from './orders-undelivered-grid.component';

describe('OrdersUndeliveredGridComponent', () => {
  let component: OrdersUndeliveredGridComponent;
  let fixture: ComponentFixture<OrdersUndeliveredGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersUndeliveredGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersUndeliveredGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
