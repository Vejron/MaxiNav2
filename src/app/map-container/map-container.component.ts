import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Area } from '../shared/models/area'
import { ThreejsLayer } from '../lib/three-js-layer'
import * as THREE from 'three';
import { } from '@types/googlemaps';

@Component({
   selector: 'app-map-container',
   templateUrl: './map-container.component.html',
   styleUrls: ['./map-container.component.scss']
})
export class MapContainerComponent implements OnInit, OnChanges {
   @Input() area

   options: any; // map init options
   map: google.maps.Map; // map instance
   threejsLayer: any; // 3d layer

   constructor() { }

   ngOnInit() {
      this.options = {
         center: { lat: 36.890257, lng: 30.707417 },
         zoom: 12
      };
   }

   ngOnChanges(changes: SimpleChanges) {
      for (let propName in changes) {
         let chng = changes[propName];
         let cur = JSON.stringify(chng.currentValue);
         let prev = JSON.stringify(chng.previousValue);
         console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
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

   private geometry = new THREE.BufferGeometry();
   private readonly MAX_POINTS = 5000000;
   private positions = new Float32Array(this.MAX_POINTS * 3);
   private drawCount = 0;

   updateArea(area: Area) {

   }

   private setupThreeLayer(map: any) {

      //mock geometry
      this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
      //this.geometry.setDrawRange( 0, this.drawCount );
      var that = this;

      var material = new THREE.LineBasicMaterial({
         color: 0xff00ff
      });

      this.threejsLayer = new ThreejsLayer({ map: this.map }, function (layer) {



         /*var geometry = new THREE.Geometry();
         geometry.vertices.push(
            layer.fromLatLngToVertex(new google.maps.LatLng(64, 23)),
            layer.fromLatLngToVertex(new google.maps.LatLng(20, 23)),
            layer.fromLatLngToVertex(new google.maps.LatLng(64, 70))
         );*/



         console.log('threeJs layer ready');
      });
      var line = new THREE.Line(that.geometry, material);
      that.generateMockgeometry(line);
      this.threejsLayer.add(line);
   }

   private generateMockgeometry(line) {
      var loo = line;
      var positions = line.geometry.attributes.position.array;

      let projection = this.map.getProjection();
      let point = projection.fromLatLngToPoint(new google.maps.LatLng(36.890257, 30.707417));

      for (let i = 0, index = 0; i < this.MAX_POINTS; i++) {

         positions[index++] = point.x;
         positions[index++] = 255 - point.y;
         positions[index++] = 0;

         point.x += (Math.random() - 0.5) * 0.01;
         point.y += (Math.random() - 0.5) * 0.01;

      }
   }
}
