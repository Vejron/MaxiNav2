import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/rx';
import { LiveTrackingService } from '../shared/services/live-tracking.service'
import { Area } from '../shared/models/area'
import { MapContainerComponent } from '../map-container/map-container.component'

@Component({
   selector: 'app-area-container',
   templateUrl: './area-container.component.html',
   styleUrls: ['./area-container.component.scss']
})
export class AreaContainerComponent implements OnInit, AfterViewInit, OnDestroy  {

   @ViewChild(MapContainerComponent)
   private mapContainerComponent: MapContainerComponent;

   public areas: Array<Area>; // all areas visibile by this this user (fetch from server?)
   public selectedArea: Area; // currently selected area

   private trackingSubscription: Subscription;

   constructor(private liveTrackingService: LiveTrackingService) { }

   ngOnInit() {
      this.selectedArea = new Area();
   }

   ngAfterViewInit() {
      // subscribe to tracking stream
      this.liveTrackingService.startStream();
      this.trackingSubscription = this.liveTrackingService.tracking$.subscribe((areaData) => {
         this.selectedArea.updateTracks(areaData.tracks); // update model
         this.updateMapContainer(this.selectedArea);      // update map child container
      });
   }

   ngOnDestroy() {
      // clean up subscription (just in case)
      if(this.trackingSubscription) {
         this.trackingSubscription.unsubscribe();
      }
   }

   private updateMapContainer(area: Area) {
      this.mapContainerComponent.updateArea(area);
   }

}
