import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginSigninComponent } from './login-signin.component';

describe('LoginSigninComponent', () => {
  let component: LoginSigninComponent;
  let fixture: ComponentFixture<LoginSigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginSigninComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
