import * as THREE from 'three';
import { } from '@types/googlemaps';
import { Area, Entity, ITree } from './area'

export class GlProduction {
   private material = new THREE.PointsMaterial({
      size: 10,
      color: 0xFFFFFF,
      vertexColors: true
   });
   private readonly MAX_POINTS = 100000; //even
   private geometry = new THREE.BufferGeometry();
   private points;

   constructor() {
      let positions = new Float32Array(this.MAX_POINTS * 3);
      let colors = new Float32Array(this.MAX_POINTS * 3);

      this.geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
      this.geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
      this.points = new THREE.Points(this.geometry, this.material);
      this.points.frustumCulled = false;
   }

   newProduction(trees: Array<ITree>, projection) {
      let positions = this.geometry.attributes.position.array;
      let colors = this.geometry.attributes.color.array;
      let index = 0;
      let r = 0, g = Math.random(), b = 0;

      for (let i = 0; i < trees.length; i++) {

         let latlng0 = new google.maps.LatLng(trees[i].lng, trees[i].lat);
         let point0 = projection.fromLatLngToPoint(latlng0);

         colors[index] = r;
         colors[index + 1] = Math.random();
         colors[index + 2] = b;

         positions[index] = point0.x;
         positions[index + 1] = 255 - point0.y;
         positions[index + 2] = 0;

         index += 3;
      }
      console.log(`production array size: ${index}`);
      this.geometry.setDrawRange(0, index / 3);
      this.geometry.attributes.position.needsUpdate = true;
      this.geometry.attributes.color.needsUpdate = true;
   }

   setVerticesTest(projection: google.maps.Projection) {
      let positions = this.geometry.attributes.position.array;
      let colors = this.geometry.attributes.color.array;
      let path = [];
      let start = new google.maps.LatLng(36.890257, 30.707417);
      for (let i = 0; i < this.MAX_POINTS; i++) {
         path.push(start);
         let lat = start.lat() + (Math.random() - 0.5) * 0.1;
         let lng = start.lng() + (Math.random() - 0.5) * 0.1;
         start = new google.maps.LatLng(lat, lng);
      }

      for (let i = 0, index = 0; i < path.length; i++) {

         let point0 = projection.fromLatLngToPoint(path[i]);

         colors[index] = Math.random();
         colors[index + 1] = Math.random();
         colors[index + 2] = Math.random();

         positions[index] = point0.x;
         positions[index + 1] = 255 - point0.y;
         positions[index + 2] = 0;

         index += 3;
      }
      this.geometry.setDrawRange(0, 100);
   }

   set(layer) {
      layer.add(this.points);
   }

   remove(layer) {
      layer.remove(this.points);
   }

   dispose() {
      // dispose gl buffers
      this.geometry.dispose();
      this.material.dispose();
   }
}

export class GlProductionSprite {
   private material;
   private readonly MAX_POINTS = 100000; //even
   private geometry = new THREE.BufferGeometry();
   private points;

   constructor() {
      let positions = new Float32Array(this.MAX_POINTS * 3);
      let colors = new Float32Array(this.MAX_POINTS * 3);
      let sizes = new Float32Array(this.MAX_POINTS * 1);

      this.geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
      this.geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
      this.geometry.addAttribute('ca', new THREE.BufferAttribute(colors, 3));

      let texture = new THREE.TextureLoader().load("/assets/disc.png");
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

      this.material = new THREE.ShaderMaterial( {
				uniforms: {
					amplitude: { value: 1.0 },
					color:     { value: new THREE.Color( 0xffffff ) },
					texture:   { value: texture }
				},
				vertexShader:   document.getElementById( 'vertexshader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
				transparent:    true
			});
      
      this.points = new THREE.Points( this.geometry, this.material );
   }

   newProduction(trees: Array<ITree>, projection) {
      let positions = this.geometry.attributes.position.array;
      let colors = this.geometry.attributes.ca.array;
      let sizes = this.geometry.attributes.size.array;

      let index = 0;
      let r = 0, b = 0;

      for (let i = 0; i < trees.length; i++) {

         let latlng0 = new google.maps.LatLng(trees[i].lng, trees[i].lat);
         let point0 = projection.fromLatLngToPoint(latlng0);

         colors[index] = r;
         colors[index + 1] = Math.random();
         colors[index + 2] = b;

         positions[index] = point0.x;
         positions[index + 1] = 255 - point0.y;
         positions[index + 2] = 0;

         index += 3;
      }
      console.log(`production array size: ${index}`);
      this.geometry.setDrawRange(0, index / 3);
      this.geometry.attributes.position.needsUpdate = true;
      this.geometry.attributes.ca.needsUpdate = true;
      this.geometry.computeBoundingSphere();
   }

   setVerticesTest(projection: google.maps.Projection) {
      let positions = this.geometry.attributes.position.array;
      let colors = this.geometry.attributes.ca.array;
      let sizes = this.geometry.attributes.size.array;

      let path = [];
      let start = new google.maps.LatLng(36.890257, 30.707417);
      for (let i = 0; i < this.MAX_POINTS; i++) {
         path.push(start);
         let lat = start.lat() + (Math.random() - 0.5) * 0.1;
         let lng = start.lng() + (Math.random() - 0.5) * 0.1;
         start = new google.maps.LatLng(lat, lng);
      }

      for (let i = 0, index = 0; i < path.length; i++) {

         let point0 = projection.fromLatLngToPoint(path[i]);

         colors[index] = Math.random();
         colors[index + 1] = Math.random();
         colors[index + 2] = Math.random();

         positions[index] = point0.x;
         positions[index + 1] = 255 - point0.y;
         positions[index + 2] = 0;

         sizes[i] = 32;

         index += 3;
      }
      this.geometry.setDrawRange(0, 100);
   }

   set(layer) {
      layer.add(this.points);
   }

   remove(layer) {
      layer.remove(this.points);
   }

   dispose() {
      // dispose gl buffers
      this.geometry.dispose();
      this.material.dispose();
   }
}