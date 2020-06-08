import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BacksidemodelFormComponent } from './backsidemodel-form.component';

describe('BacksidemodelFormComponent', () => {
  let component: BacksidemodelFormComponent;
  let fixture: ComponentFixture<BacksidemodelFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BacksidemodelFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BacksidemodelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
