import {Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {IoTService} from "../common/services/iot.service";
import { MatTableModule } from '@angular/material/table';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-device-view',
  templateUrl: './devices-view.component.html',
  styleUrls: ['./devices-view.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ],
  standalone: true,
  imports: [
    MatTableModule
  ]
})

export class DevicesViewComponent implements OnInit {
  devices: DeviceRow[] = [];
  columnsToDisplay: string[] = [
    'id',
    'status',
    'testDevice',
    'location',
    'fwVersion',
    'gitRevision',
    'doSleep',
    'measureBatchSize',
    'measureIntervalMs',
    'sleepTimeSec',
    'lastUpdated'
  ];
  columnTitles: string[] = [
    'Device',
    'Status',
    'Test Device',
    'Location',
    'Firmware',
    'Version',
    'Sleep',
    'BatchSize',
    'MeasureInterval(ms)',
    'SleepTime(s)',
    'Updated'
  ];
  expandedElement: DeviceRow | null = null;
  //datasource = this.devices;

  constructor(private iotService: IoTService) {
  }

  ngOnInit(): void {
//console.log("devices:", this.devices);
    let self = this;
    this.iotService.getDevices().subscribe({
      next(devs) {
        console.log("got dev: "+devs);
        self.devices = devs.map( d => {return {
          id: d.id,
          status: d.status,
          testDevice: d.testDevice,
          fwVersion: d.reportedProperties.fwVersion,
          gitRevision: d.reportedProperties.gitRevision,
          doSleep: d.reportedProperties.doSleep,
          measureBatchSize: d.reportedProperties.measureBatchSize,
          measureIntervalMs: d.reportedProperties.measureBatchSize,
          sleepTimeSec: d.reportedProperties.sleepTimeSec,
          lastUpdated: DateTime.now().toFormat('f'),
          location: d.tags?.location
        }});

      }
    });
  }
}

export interface DeviceRow {
  id: string,
  status: string,
  testDevice: boolean,
  fwVersion: string,
  gitRevision: string,
  doSleep: boolean,
  measureBatchSize: number,
  measureIntervalMs: number,
  sleepTimeSec: number,
  lastUpdated: string,

  location: string

}
