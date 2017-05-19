import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapRtComponent } from './map-rt.component';

describe('MapRtComponent', () => {
  let component: MapRtComponent;
  let fixture: ComponentFixture<MapRtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapRtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
