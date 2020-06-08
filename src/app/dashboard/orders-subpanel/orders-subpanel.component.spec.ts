import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersSubpanelComponent } from './orders-subpanel.component';

describe('OrdersSubpanelComponent', () => {
  let component: OrdersSubpanelComponent;
  let fixture: ComponentFixture<OrdersSubpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersSubpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersSubpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
