import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Measurement} from "../measurement";
import {IoTService} from "../iot.service";
import {DatePipe} from "@angular/common";
import {MeasurementType} from "../measurement-type";

@Component({
  selector: 'app-chart-view-time',
  templateUrl: './chart-view-time.component.html',
  styleUrls: ['./chart-view-time.component.css']
})
export class ChartViewTimeComponent implements OnInit {
  pipe = new DatePipe('en-US');
  private fmt: string = 'yyyyMMdd';

  measurements: Measurement[] = [];
  devices = ['DOIT1', 'BME280-1', 'DALLAS1', 'ESP32-1']
  measTypes: MeasurementType[] = [
    {name: 'Temperature', code1: 't1', code2: 't2', unit: '°C'},
    {name: 'Pressure', code1: 'p', code2: undefined, unit: 'hPa'},
    {name: 'Humidity', code1: 'h', code2: undefined, unit: '%'}];

  measDate: string = this.pipe.transform(new Date(), this.fmt) ?? "";
  measDevice = this.devices[0];

  measType!: MeasurementType
  measType2: MeasurementType|undefined = undefined

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
    this.measDate = this.pipe.transform($event, 'yyyyMMdd') ?? "";
    this.readMeasurements()
  }

  onSelectedDevice($event: string) {
    console.log("device change: ", $event)
    this.measDevice = $event
    this.readMeasurements()
  }

  onSelectedMeasurement($event: MeasurementType) {
    this.measType = $event
  }

  onSelectedMeasurement2($event: MeasurementType) {
    this.measType2 = $event
  }
}
