import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageNotificationDummyComponent } from './message-notification-dummy.component';

describe('MessageNotificationDummyComponent', () => {
  let component: MessageNotificationDummyComponent;
  let fixture: ComponentFixture<MessageNotificationDummyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageNotificationDummyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageNotificationDummyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
