import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { Area, Entity } from '../shared/models/area'
import { ThreejsLayer } from '../lib/three-js-layer'
import * as THREE from 'three';
import { } from '@types/googlemaps';
import { GlPath, GlTest } from '../shared/models/gl-path';
import { GlProduction, GlProductionSprite } from '../shared/models/gl-production';

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
   //tracks;

   private trails: GlPath;
   private production;

   constructor(public element: ElementRef) { }

   ngOnInit() {
      this.options = {
         center: { lat: 36.890257, lng: 30.707417 },
         zoom: 18
      };

      this.map = new google.maps.Map(this.element.nativeElement.children[0], this.options);
      google.maps.event.addListenerOnce(this.map, "projection_changed", () => {
         this.setupThreeLayer(this.map);
         console.log('map projection availible');
      });
   }

   ngOnChanges(changes: SimpleChanges) {
      for (let propName in changes) {
         let current : Area = changes[propName].currentValue;
         if(propName === 'area' && current) {
            // new area selected
            if(current.entities.length > 0) {

               //this.trails.newTrails(current.entities, this.map.getProjection());
               this.production.newProduction(current.production, this.map.getProjection());

               this.map.panTo(current.entities[0].locationHistory[0]);

               //test rt component
               //this.tracks = current.entities;
            }
         }
      }
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

      this.trails = new GlPath();
      this.trails.setVerticesTest(projection);
      this.trails.set(this.threejsLayer);

      this.production = new GlProductionSprite();
      this.production.setVerticesTest(projection);
      this.production.set(this.threejsLayer);

   }
}
