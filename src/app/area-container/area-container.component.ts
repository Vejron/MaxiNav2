import { Component, OnInit } from '@angular/core';
import { LiveTrackingService } from '../shared/services/live-tracking.service'

@Component({
  selector: 'app-area-container',
  templateUrl: './area-container.component.html',
  styleUrls: ['./area-container.component.scss']
})
export class AreaContainerComponent implements OnInit {

  constructor(private liveTrackingService: LiveTrackingService ) { }

  ngOnInit() {
  }

}
