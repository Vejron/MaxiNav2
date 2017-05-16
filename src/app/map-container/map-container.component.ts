import { Component, OnInit } from '@angular/core';
import { Area } from '../shared/models/area'
import { ThreejsLayer } from '../lib/three-js-layer'
import * as THREE from 'three';
import {} from '@types/googlemaps';

@Component({
   selector: 'app-map-container',
   templateUrl: './map-container.component.html',
   styleUrls: ['./map-container.component.scss']
})
export class MapContainerComponent implements OnInit {

   options: any; // map init options
   map: any; // map instance
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

   updateArea(area: Area) {

   }

   private setupThreeLayer(map: any) {

      this.threejsLayer = new ThreejsLayer({ map: this.map }, function (layer) {

         var material = new THREE.LineBasicMaterial({
            color: 0x0000ff
         });

         var geometry = new THREE.Geometry();
         geometry.vertices.push(
            layer.fromLatLngToVertex(new google.maps.LatLng(64, 23)),
            layer.fromLatLngToVertex(new google.maps.LatLng(20, 23)),
            layer.fromLatLngToVertex(new google.maps.LatLng(64, 70))
         );

         var line = new THREE.Line(geometry, material);
         //var geometry = new THREE.Geometry(),

         //geometry.vertices.push(vertex);

         //var particles = new THREE.ParticleSystem(geometry, material);
         layer.add(line);
         console.log('threeJs layer ready');
      });
   }
}
