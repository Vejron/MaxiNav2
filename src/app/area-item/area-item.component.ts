import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
   selector: 'app-area-item',
   templateUrl: './area-item.component.html',
   styleUrls: ['./area-item.component.scss']
})
export class AreaItemComponent implements OnInit {
   @Input() area;
   @Output() selected = new EventEmitter<any>();

   constructor() { }

   ngOnInit() {
   }

   clicked() {
      this.selected.emit(this.area);
   }

}
