import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionLayerComponent } from './production-layer.component';

describe('ProductionLayerComponent', () => {
  let component: ProductionLayerComponent;
  let fixture: ComponentFixture<ProductionLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductionLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
