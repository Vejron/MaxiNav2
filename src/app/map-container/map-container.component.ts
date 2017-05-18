import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Area, Entity } from '../shared/models/area'
import { ThreejsLayer } from '../lib/three-js-layer'
import * as THREE from 'three';
import { } from '@types/googlemaps';
import { GlPath, GlTest } from '../shared/models/gl-path';

@Component({
   selector: 'app-map-container',
   templateUrl: './map-container.component.html',
   styleUrls: ['./map-container.component.scss']
})
export class MapContainerComponent implements OnInit, OnChanges {
   @Input() area: Area

   options: any; // map init options
   map: google.maps.Map; // map instance
   threejsLayer: any; // 3d layer

   private trails: GlPath;

   constructor() { }

   ngOnInit() {
      this.options = {
         center: { lat: 36.890257, lng: 30.707417 },
         zoom: 12
      };
   }

   ngOnChanges(changes: SimpleChanges) {
      for (let propName in changes) {
         let current : Area = changes[propName].currentValue;
         if(propName === 'area' && current) {
            // new area selected
            if(current.entities.length > 0) {

               this.trails.newTrails(current.entities, this.map.getProjection());
               this.map.panTo(current.entities[0].locationHistory[0]);

            }
         }
      }
   }

   setMap(event) {
      this.map = event.map;
      console.log('map instance ready');
      // wait for projection changed event before continuing 
      // otherwise getProjection returns null 
      google.maps.event.addListenerOnce(this.map, "projection_changed", () => {
         this.setupThreeLayer(this.map);
         console.log('map projection availible');
      });
   }

   updateArea(area: Area) {

   }

   private setupThreeLayer(map: any) {
      
      this.threejsLayer = new ThreejsLayer({ map: this.map }, function (layer) {
         console.log('threeJs layer ready');
      });

      let projection = map.getProjection();
      
      //let test = new GlTest(projection);
      //test.set(this.threejsLayer);

      this.trails = new GlPath(projection);
      this.trails.setVerticesTest(projection);
      this.trails.set(this.threejsLayer);

      //this.threejsLayer.add(test.getSceneObject());
   }
}
