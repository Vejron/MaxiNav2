import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
   selector: 'app-area-listing',
   templateUrl: './area-listing.component.html',
   styleUrls: ['./area-listing.component.scss']
})
export class AreaListingComponent implements OnInit {
   @Input() areas;
   @Output() selected = new EventEmitter<any>();
   
   selectedArea;

   constructor() { }

   ngOnInit() {
   }

   onSelected(area) {
      this.selectedArea = area; // used to style selection
      this.selected.emit(area); // sent to parent for further processing
      console.log(area.name);
   }
}
