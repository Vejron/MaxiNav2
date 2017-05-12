import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaListingComponent } from './area-listing.component';

describe('AreaListingComponent', () => {
  let component: AreaListingComponent;
  let fixture: ComponentFixture<AreaListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
