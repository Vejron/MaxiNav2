import { Component, OnInit, Input } from '@angular/core';
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

  constructor() { }

  ngOnInit() {
  }

  onClick() {
    if(!this.isActive) {
      this.isActive = true;
      this.map.set('draggableCursor', 'crosshair');
      this.clickEvent = this.map.addListener('click', (e) => {
        console.log(e);
      })
    } else {
      this.isActive = false;
      this.map.set('draggableCursor', 'default');
      google.maps.event.removeListener(this.clickEvent);
    }

  }

}
