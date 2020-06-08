import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersSubpanelComponent } from './customers-subpanel.component';

describe('CustomersSubpanelComponent', () => {
  let component: CustomersSubpanelComponent;
  let fixture: ComponentFixture<CustomersSubpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomersSubpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersSubpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
