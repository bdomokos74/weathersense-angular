import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {HttpClient} from "@angular/common/http";

const IOTHUB_DEV_ENDPOINT = "/hub/devices?api-version=2020-05-31-preview";

@Component({
  selector: 'app-device-view',
  templateUrl: './device-view.component.html',
  styleUrls: ['./device-view.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})

export class DeviceViewComponent implements OnInit {
  devices: DeviceRow[] = [];
  columnsToDisplay: string[] = ['deviceId', 'modelId', 'status', 'version'];
  expandedElement: DeviceRow | null = null;
  //datasource = this.devices;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
//console.log("devices:", this.devices);
    this.getDevices();
  }

  getDevices() {
    this.http.get<DeviceRow[]>(IOTHUB_DEV_ENDPOINT, {headers: {"x-ms-version": "2020-04-08"}})
      .subscribe(data => {
        this.devices = data;
      });
  }
}

export interface DeviceRow {
  deviceId: string,
  modelId: string,
  status: string,
  version: number
}
