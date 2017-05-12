import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaContainerComponent } from './area-container.component';

describe('AreaContainerComponent', () => {
  let component: AreaContainerComponent;
  let fixture: ComponentFixture<AreaContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
