import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineLayerComponent } from './machine-layer.component';

describe('MachineLayerComponent', () => {
  let component: MachineLayerComponent;
  let fixture: ComponentFixture<MachineLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
