import { Component, OnInit } from '@angular/core';
import { Area } from '../shared/models/area'
import { ThreejsLayer } from '../lib/three-js-layer'
import * as THREE from 'three';
import { } from '@types/googlemaps';

@Component({
   selector: 'app-map-container',
   templateUrl: './map-container.component.html',
   styleUrls: ['./map-container.component.scss']
})
export class MapContainerComponent implements OnInit {

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

   setMap(event) {
      this.map = event.map;
      console.log('map instance ready');
      this.setupThreeLayer(this.map);
   }

   private geometry = new THREE.BufferGeometry();
   private readonly MAX_POINTS = 5000000;
   private positions = new Float32Array(this.MAX_POINTS * 3);
   private drawCount = 0;

   updateArea(area: Area) {

   }

   private setupThreeLayer(map: any) {

      //mock geometry
      this.geometry.addAttribute( 'position', new THREE.BufferAttribute( this.positions, 3 ) );
      //this.geometry.setDrawRange( 0, this.drawCount );
      var that = this;

      this.threejsLayer = new ThreejsLayer({ map: this.map }, function (layer) {

         var material = new THREE.LineBasicMaterial({
            color: 0xff00ff
         });

         /*var geometry = new THREE.Geometry();
         geometry.vertices.push(
            layer.fromLatLngToVertex(new google.maps.LatLng(64, 23)),
            layer.fromLatLngToVertex(new google.maps.LatLng(20, 23)),
            layer.fromLatLngToVertex(new google.maps.LatLng(64, 70))
         );*/

         var line = new THREE.Line(that.geometry, material);
         that.generateMockgeometry(line);
         layer.add(line);

         console.log('threeJs layer ready');
      });
   }

   private generateMockgeometry(line) {
      var loo = line;
      var positions = line.geometry.attributes.position.array;

      let projection = this.map.getProjection();
      let point = projection.fromLatLngToPoint(new google.maps.LatLng(36.890257, 30.707417));

      for ( let i = 0, index = 0; i < this.MAX_POINTS; i ++ ) {

         positions[ index ++ ] = point.x;
         positions[ index ++ ] = 255 - point.y;
         positions[ index ++ ] = 0;

         point.x += ( Math.random() - 0.5 ) * 0.01;
         point.y += ( Math.random() - 0.5 ) * 0.01;

	   }
   }
}
