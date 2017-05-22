import { Component, OnInit, Input, NgZone } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { } from '@types/googlemaps';

@Component({
   selector: 'app-notification-layer',
   templateUrl: './notification-layer.component.html',
   styleUrls: ['./notification-layer.component.scss']
})
export class NotificationLayerComponent implements OnInit {
   @Input() map: google.maps.Map;

   isActive = false;
   private clickEvent: google.maps.MapsEventListener;

   constructor(public dialog: MdDialog, public zone: NgZone) { }

   ngOnInit() {
   }

   onClick() {
      if (!this.isActive) {
         this.isActive = true;
         this.map.set('draggableCursor', 'crosshair');
         this.clickEvent = this.map.addListener('click', (e) => {
            // invoke via zone as this event is something angular is not aware of
            this.zone.run(() => this.openDialog(e.latLng))
         })
      } else {
         this.isActive = false;
         this.map.set('draggableCursor', 'move');
         google.maps.event.removeListener(this.clickEvent);
      }

   }

   openDialog(latLng: google.maps.LatLng) {
      let dialogRef = this.dialog.open(DialogOverviewExampleDialog);

      dialogRef.afterClosed().subscribe(result => {
         console.log('dialog closed');

         if (result) {
            // add marker to map
            let marker = new google.maps.Marker({
               position: latLng,
               map: this.map,
               title: result
            });
         }
      })
   }
}

@Component({
   template: `
      <h2>Mark something</h2>

      <md-button-toggle-group #group="mdButtonToggleGroup">
         <md-button-toggle value="info">
            <md-icon>info_outline</md-icon>
         </md-button-toggle>
         <md-button-toggle value="warning">
            <md-icon [color]="red">warning</md-icon>
         </md-button-toggle>
         <md-button-toggle value="gas">
            <md-icon>local_gas_station</md-icon>
         </md-button-toggle>
         <md-button-toggle value="notification">
            <md-icon>notifications</md-icon>
         </md-button-toggle>
      </md-button-toggle-group>
      
      <p class="example-selected-value">Selected value: {{group.value}}</p>

      <button md-raised-button [disabled]="group.value === null" (click)="dialogRef.close(group.value)">Ok</button>
      <button md-raised-button (click)="dialogRef.close()">Cancel</button>`
})
export class DialogOverviewExampleDialog {
   constructor(public dialogRef: MdDialogRef<any>) { }
}
