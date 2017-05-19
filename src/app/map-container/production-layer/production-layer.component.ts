import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Area, Entity, ITree } from '../../shared/models/area'
import { ThreejsLayer } from '../../lib/three-js-layer'
import * as THREE from 'three';
import { } from '@types/googlemaps';
import { GlProductionLayer } from '../../shared/models/gl-production';

@Component({
  selector: 'app-production-layer',
  templateUrl: './production-layer.component.html',
  styleUrls: ['./production-layer.component.scss']
})
export class ProductionLayerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() map: google.maps.Map;
  @Input() area: Area;
  @Input() threeLayer: any;

  species = ['Tall', 'Gran', 'Björk', 'Ek'];
  private production: GlProductionLayer;


  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let current = changes[propName].currentValue;
      if (propName === 'threeLayer' && current) {
        // three js renderer ready
        // have to do it this way as google maps projection ready
        // event has to fire before three js renderer can be inizialized
        this.setup(current);
      } else if (propName === 'area' && current) {
        this.update(current);
      }
    }
  }

  ngOnDestroy() {
    // clean up gl stuff
    this.production.dispose();
  }

  private setup(threeLayer) {
    console.log('adding production layer');
    this.production = new GlProductionLayer();
    this.production.setVerticesTest(this.map.getProjection());
    this.production.set(this.threeLayer);
  }

  private update(area: Area) {
    // new area selected. does it have any production?
    if (area.production.length > 0) {
      this.production.newProduction(area.production, this.map.getProjection());
    }
  }

}
