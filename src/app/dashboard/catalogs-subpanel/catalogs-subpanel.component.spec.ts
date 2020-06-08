import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogsSubpanelComponent } from './catalogs-subpanel.component';

describe('CatalogsSubpanelComponent', () => {
  let component: CatalogsSubpanelComponent;
  let fixture: ComponentFixture<CatalogsSubpanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogsSubpanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogsSubpanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
