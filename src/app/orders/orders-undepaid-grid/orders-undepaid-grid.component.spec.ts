import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersUndepaidGridComponent } from './orders-undepaid-grid.component';

describe('OrdersUndepaidGridComponent', () => {
  let component: OrdersUndepaidGridComponent;
  let fixture: ComponentFixture<OrdersUndepaidGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersUndepaidGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersUndepaidGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
