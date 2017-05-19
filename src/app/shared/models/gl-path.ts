import * as THREE from 'three';
import { } from '@types/googlemaps';
import { Area, Entity, ILocation } from './area'

export class GlPath {
   private material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      vertexColors: true
   });
   private geometry = new THREE.BufferGeometry();
   private readonly MAX_POINTS = 100000; //even
   private drawCount = 0;
   private lineSegments;

   constructor() {

      let positions = new Float32Array(this.MAX_POINTS * 3 * 2);
      let colors = new Float32Array(this.MAX_POINTS * 3 * 2);

      this.geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
      this.geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
      this.lineSegments = new THREE.LineSegments(this.geometry, this.material);
   }

   colorFromStatus(status) {
      let color;
      switch (status) {
         case 'Stopped':
            color = { r: 1, g: 0, b: 0 };
            break;
         case 'TerrainTravel':
            color = { r: 1, g: 1, b: 0 };
            break;
         case 'Processing':
            color = { r: 0, g: 0, b: 1 };
            break;
         default:
            color = { r: 0, g: 0, b: 0 };
            break;
      }
      return color;
   }

   newTrails(enteties: Entity[], projection) {
      let positions = this.geometry.attributes.position.array;
      let colors = this.geometry.attributes.color.array;
      let index = 0;

      for (let entity of enteties) {

         for (let i = 0; i < entity.locationHistory.length - 1; i++) {

            let latlng0 = new google.maps.LatLng(entity.locationHistory[i].lat, entity.locationHistory[i].lng);
            let latlng1 = new google.maps.LatLng(entity.locationHistory[i + 1].lat, entity.locationHistory[i + 1].lng);

            let point0 = projection.fromLatLngToPoint(latlng0);
            let point1 = projection.fromLatLngToPoint(latlng1);

            let color = this.colorFromStatus(entity.locationHistory[i].status);

            colors[index] = color.r;
            colors[index + 1] = color.g;
            colors[index + 2] = color.b;

            colors[index + 3] = colors[index];
            colors[index + 4] = colors[index + 1];
            colors[index + 5] = colors[index + 2];

            positions[index] = point0.x;
            positions[index + 1] = 255 - point0.y;
            positions[index + 2] = 0;

            positions[index + 3] = point1.x;
            positions[index + 4] = 255 - point1.y;
            positions[index + 5] = 0;

            index += 6;

         }
      }
      console.log(`positions array size: ${index}`);
      this.geometry.setDrawRange(0, index / 3);
      this.geometry.attributes.position.needsUpdate = true;
      this.geometry.attributes.color.needsUpdate = true;
      this.geometry.computeBoundingSphere();
   }

   setVerticesTest(projection: google.maps.Projection) {
      let positions = this.geometry.attributes.position.array;
      let colors = this.geometry.attributes.color.array;

      //let point = projection.fromLatLngToPoint(new google.maps.LatLng(36.890257, 30.707417));

      let path = [];
      let start = new google.maps.LatLng(36.890257, 30.707417);
      for (let i = 0; i < this.MAX_POINTS; i++) {
         path.push(start);
         let lat = start.lat() + (Math.random() - 0.5) * 0.1;
         let lng = start.lng() + (Math.random() - 0.5) * 0.1;
         start = new google.maps.LatLng(lat, lng);
      }

      for (let i = 0, index = 0; i < path.length - 1; i++) {

         let point0 = projection.fromLatLngToPoint(path[i]);
         let point1 = projection.fromLatLngToPoint(path[i + 1]);

         colors[index] = Math.random();
         colors[index + 1] = Math.random();
         colors[index + 2] = Math.random();

         colors[index + 3] = colors[index];
         colors[index + 4] = colors[index + 1];
         colors[index + 5] = colors[index + 2];

         positions[index] = point0.x;
         positions[index + 1] = 255 - point0.y;
         positions[index + 2] = 0;

         positions[index + 3] = point1.x;
         positions[index + 4] = 255 - point1.y;
         positions[index + 5] = 0;

         index += 6;
      }
   }

   set(layer) {
      layer.add(this.lineSegments);
   }

   remove(layer) {
      layer.remove(this.lineSegments);
   }

   getSceneObject() {
      return this.lineSegments;
   }

   dispose() {
      // dispose gl buffers
      this.geometry.dispose();
      this.material.dispose();
   }

}

export class GlTestLines {
   private geometry = new THREE.BufferGeometry();
   private readonly MAX_POINTS = 5000000;
   private positions = new Float32Array(this.MAX_POINTS * 3);
   private drawCount = 0;
   private material;
   private path;

   constructor(projection) {
      this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
      this.material = new THREE.LineBasicMaterial({
         color: 0xff00ff
      });
      this.path = new THREE.Line(this.geometry, this.material);
      this.generateMockgeometry(projection);
   }

   private generateMockgeometry(projection) {

      var positions = this.path.geometry.attributes.position.array;

      let point = projection.fromLatLngToPoint(new google.maps.LatLng(36.890257, 30.707417));

      for (let i = 0, index = 0; i < this.MAX_POINTS; i++) {

         positions[index++] = point.x;
         positions[index++] = 255 - point.y;
         positions[index++] = 0;

         point.x += (Math.random() - 0.5) * 0.01;
         point.y += (Math.random() - 0.5) * 0.01;

      }
   }

   set(layer) {
      layer.add(this.path);
   }

   remove(layer) {
      layer.remove(this.path);
   }

   getSceneObject() {
      return this.path;
   }

   dispose() {
      this.geometry.dispose();
      this.material.dispose();
   }
}

export class GlTest {
   private geometry = new THREE.BufferGeometry();
   private readonly MAX_POINTS = 5000000;
   private positions = new Float32Array(this.MAX_POINTS * 3);
   private drawCount = 0;
   private material;
   private path;

   constructor(projection) {
      this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
      this.material = new THREE.LineBasicMaterial({
         color: 0xff00ff
      });
      //this.path = new THREE.Line(this.geometry, this.material);
      this.generateMockgeometry(projection);
   }

   private generateMockgeometry(projection) {

      var starsGeometry = new THREE.Geometry();

      let point = projection.fromLatLngToPoint(new google.maps.LatLng(36.890257, 30.707417));
      for (var i = 0; i < 10000; i++) {

         var star = new THREE.Vector3();
         star.x = point.x;
         star.y = 255 - point.y;
         star.z = 0;

         starsGeometry.vertices.push(star)
         starsGeometry.colors.push( new THREE.Color('blue'));

         point.x += (Math.random() - 0.5) * 0.01;
         point.y += (Math.random() - 0.5) * 0.01;

      }

      var starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 10, vertexColors: true })

      this.path = new THREE.Points(starsGeometry, starsMaterial);
   }

   set(layer) {
      layer.add(this.path);
   }

   remove(layer) {
      layer.remove(this.path);
   }

   getSceneObject() {
      return this.path;
   }

   dispose() {
      this.geometry.dispose();
      this.material.dispose();
   }
}