import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Measurement} from "../measurement";
import {IoTService} from "../iot.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-chart-view-time',
  templateUrl: './chart-view-time.component.html',
  styleUrls: ['./chart-view-time.component.css']
})
export class ChartViewTimeComponent implements OnInit {
  pipe = new DatePipe('en-US');
  private fmt: string = 'yyyyMMdd';

  measurements: Measurement[] = [];
  devices = ["DOIT1", "BME280-1", "DALLAS1", "ESP32-1"]

  measDate: string = this.pipe.transform(new Date(), this.fmt)??"";
  measDevice = this.devices[0];


  constructor(private http: HttpClient, private iotService: IoTService) {
  }

  ngOnInit() {
    console.log("ngOnInit");
    this.readMeasurements();
  }

  private readMeasurements() {
    let self = this
    this.iotService.getMeasurements(this.measDevice, this.measDate)
      .subscribe(
        data => {
          self.measurements = data
        },
        err => {
          console.log("error:", err);
          self.measurements = []
        },
        () => {
          console.log('done');
        }
      );
  }

  onMeasDate($event: Date) {
    this.measDate = this.pipe.transform($event, 'yyyyMMdd')??"";
    // this.iotService.getMeasurements(this.measDevice, this.measDate)
    //   .subscribe(data => this.measurements = data);
    this.readMeasurements()
  }

  onSelectedDevice($event: string) {
    console.log("device change: ", $event)
    this.measDevice = $event
    // this.iotService.getMeasurements(this.measDevice, this.measDate)
    //   .subscribe(data => this.measurements = data);
    this.readMeasurements()
  }


}
