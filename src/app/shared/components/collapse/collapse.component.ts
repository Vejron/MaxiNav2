import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-collapse',
  templateUrl: './collapse.component.html',
  styleUrls: ['./collapse.component.scss']
})
export class CollapseComponent implements OnInit {

  title = 'Title';
  toggled = false;

  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.toggled = !this.toggled;
  }

}
