import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardsidemodelFormComponent } from './forwardsidemodel-form.component';

describe('ForwardsidemodelFormComponent', () => {
  let component: ForwardsidemodelFormComponent;
  let fixture: ComponentFixture<ForwardsidemodelFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForwardsidemodelFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardsidemodelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
