import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NeckmodelFormComponent } from './neckmodel-form.component';

describe('NeckmodelFormComponent', () => {
  let component: NeckmodelFormComponent;
  let fixture: ComponentFixture<NeckmodelFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NeckmodelFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NeckmodelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
