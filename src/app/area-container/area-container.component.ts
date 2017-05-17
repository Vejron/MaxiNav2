import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/rx';
import { AreaService } from '../shared/services/area.service'
import { LiveTrackingService } from '../shared/services/live-tracking.service'
import { Area } from '../shared/models/area'
import { MapContainerComponent } from '../map-container/map-container.component'

@Component({
   selector: 'app-area-container',
   templateUrl: './area-container.component.html',
   styleUrls: ['./area-container.component.scss']
})
export class AreaContainerComponent implements OnInit, AfterViewInit, OnDestroy {

   @ViewChild(MapContainerComponent)
   private mapContainerComponent: MapContainerComponent;

   public areas: Array<Area>; // all areas visible by this this user (fetch from server?)
   public selectedArea: Area; // currently selected area

   private trackingSubscription: Subscription; // live tracking data

   constructor(
      private liveTrackingService: LiveTrackingService,
      private areaService: AreaService) { }

   ngOnInit() {
      //this.selectedArea = new Area();

      // get areas for initial listing
      this.areaService.getAreaDefs()
         .subscribe(
         areas => this.areas = areas,
         error => console.log(error));
   }

   ngAfterViewInit() {
      // subscribe to tracking stream
      //this.liveTrackingService.startStream();
      this.trackingSubscription = this.liveTrackingService.tracking$.subscribe((areaData) => {
         this.selectedArea.updateTracks(areaData.tracks); // update model
         this.updateMapContainer(this.selectedArea);      // update map child container
      });
   }

   ngOnDestroy() {
      // clean up subscription (just in case)
      if (this.trackingSubscription) {
         this.trackingSubscription.unsubscribe();
      }
   }

   private onAreaSelected(area: Area) {
      console.log('new area selected:')
      if (!area.hasContent) {
         // fetch tracking etc from server
         this.areaService.getTracking(area.uid)
            .subscribe(
            enteties => {
               area.entities = enteties;
               area.hasContent = true;
               console.log(enteties);
               // finally select it
               this.selectedArea = area;
            },
            error => console.log(error));
      } else {
         this.selectedArea = area;
      }
   }

   private updateMapContainer(area: Area) {
      this.mapContainerComponent.updateArea(area);
   }

}
