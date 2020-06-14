import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionConfirmDummyComponent } from './action-confirm-dummy.component';

describe('ActionConfirmDummyComponent', () => {
  let component: ActionConfirmDummyComponent;
  let fixture: ComponentFixture<ActionConfirmDummyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionConfirmDummyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionConfirmDummyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
