import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-machine-layer',
  templateUrl: './machine-layer.component.html',
  styleUrls: ['./machine-layer.component.scss']
})
export class MachineLayerComponent implements OnInit {

  machines = ['901-XC-0001', '931-XC', '845-P'];
  statusTypes = ['Processing', 'Terrain travel', 'Stopped', 'Other'];
  constructor() { }

  ngOnInit() {
  }

}
