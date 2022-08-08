import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import devicesJson from '../../assets/devices';

@Component({
  selector: 'app-device-view',
  templateUrl: './device-view.component.html',
  styleUrls: ['./device-view.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})



export class DeviceViewComponent implements OnInit {
  devices: DeviceRow[] = devicesJson.data;
  columnsToDisplay: string[] = ['deviceId', 'modelId', 'status', 'version'];
  expandedElement: DeviceRow | null = null;
  //datasource = this.devices;

  constructor() {
  }

  ngOnInit(): void {
    console.log("devices:", this.devices);
  }

}

export interface DeviceRow {
  deviceId: string,
  modelId: string,
  status: string,
  version: number
}
