import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WristmodelFormComponent } from './wristmodel-form.component';

describe('WristmodelFormComponent', () => {
  let component: WristmodelFormComponent;
  let fixture: ComponentFixture<WristmodelFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WristmodelFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WristmodelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
