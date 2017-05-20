import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationLayerComponent } from './notification-layer.component';

describe('NotificationLayerComponent', () => {
  let component: NotificationLayerComponent;
  let fixture: ComponentFixture<NotificationLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
