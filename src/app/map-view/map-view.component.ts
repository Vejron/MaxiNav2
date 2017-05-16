import { Component, OnInit, AfterViewInit, Output, Input, EventEmitter, ElementRef } from '@angular/core';
import {} from '@types/googlemaps';

@Component({
   selector: 'app-map-view',
   templateUrl: './map-view.component.html',
   styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

   @Input() options: any;

   @Output() onMapReady: EventEmitter<any> = new EventEmitter();

   public map: any;

   constructor(public element: ElementRef) { }



   ngOnInit() {
   }

   ngAfterViewInit() {
      this.map = new google.maps.Map(this.element.nativeElement.children[0], this.options);
      this.onMapReady.emit({
         map: this.map
      });

      /*if (this.overlays) {
         for (let overlay of this.overlays) {
            overlay.setMap(this.map);
            this.bindOverlayEvents(overlay);
         }
      }

      this.map.addListener('click', (event) => {
         this.zone.run(() => {
            this.onMapClick.emit(event);
         });
      });*/
   }

   getMap() {
      return this.map;
   }

}
