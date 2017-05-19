import { } from '@types/googlemaps';
import { Area, Entity, ILocation } from './area'

export class GoogleTrails {
   private lines: Array<google.maps.Polyline> = [];
   
   constructor() {

   }

   private styleFromStatus(status) : google.maps.PolylineOptions {
      let color: google.maps.PolylineOptions;
      switch (status) {
         case 'Stopped':
            color = { strokeColor: 'red', strokeOpacity: 1.0, strokeWeight: 3}
            break;
         case 'TerrainTravel':
            color = { strokeColor: 'yellow', strokeOpacity: 1.0, strokeWeight: 3}
            break;
         case 'Processing':
            color = { strokeColor: 'blue', strokeOpacity: 1.0, strokeWeight: 3}
            break;
         default:
            color = { strokeColor: 'grey', strokeOpacity: 1.0, strokeWeight: 3}
            break;
      }
      return color;
   }

   create(enteties: Entity[]) {
      for (let entity of enteties) {
         let locations = entity.locationHistory;

         // create first line segment
         let status = locations[0].status;
         let polyline = new google.maps.Polyline(this.styleFromStatus(status))

         for (let i = 0; i < locations.length; i++) {
            
            // status change ?
            if(status != locations[i].status) {
               status = locations[i].status
               // store poly and start new
               polyline.getPath().push(new google.maps.LatLng(locations[i].lat, locations[i].lng));
               this.lines.push(polyline);
               polyline = new google.maps.Polyline(this.styleFromStatus(status))
            }

            polyline.getPath().push(new google.maps.LatLng(locations[i].lat, locations[i].lng));
         }
         // add last line
         this.lines.push(polyline);
      }
   }

   setMap(map: google.maps.Map) {
      if(map) {
         //set
         for (let line of this.lines) {
            line.setMap(map);
         }
      } 
   }

   clear(map: google.maps.Map) {
      if(map) {
         for (let line of this.lines) {
            line.setMap(null);
            line = null;
         }
         this.lines = [];
      } 
   }

   private mockLoc = {lat: 0, lng: 0};
   updateMock() {
      let path = this.lines[this.lines.length - 1].getPath();
      let latlng =  path.getAt(path.getLength() - 1);
      let nextLocation = new google.maps.LatLng(latlng.lat() + (Math.random() - 0.5) * 0.001, latlng.lng() + (Math.random() - 0.5) * 0.001);
      path.push(nextLocation);
   }
}