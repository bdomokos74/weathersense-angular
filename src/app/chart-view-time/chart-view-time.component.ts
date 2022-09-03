import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Measurement} from "../measurement";
import {IoTService} from "../iot.service";
import {DatePipe} from "@angular/common";
import {MeasurementType} from "../measurement-type";
import {TimeSeries} from "../timeseries";
import {ChartData} from "../chart-data";

@Component({
  selector: 'app-chart-view-time',
  templateUrl: './chart-view-time.component.html',
  styleUrls: ['./chart-view-time.component.css']
})
export class ChartViewTimeComponent implements OnInit {
  pipe = new DatePipe('en-US');
  private fmt: string = 'yyyyMMdd';

  chartData: ChartData|undefined;

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
          self.prepareData(data)
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

  private updateData() {
    let data = this.chartData?.measurements
    if(data)
      this.prepareData(data)

  }
  private prepareData(data: Measurement[]) {
    let leftSeries: TimeSeries[] = []
    let rightSeries: TimeSeries[] = []

    leftSeries.push( TimeSeries.createTimeSerie(this.measDevice, data, 'ts', this.measType.code1, this.measType, "1"))
    if( this.measType.code2) {
      let serie2 = TimeSeries.createTimeSerie(this.measDevice, data, 'ts', this.measType.code2, this.measType, "1_1");
      if(!serie2.empty)
        leftSeries.push(serie2)
    }

    if(this.measType2) {
      rightSeries.push( TimeSeries.createTimeSerie(this.measDevice, data, 'ts', this.measType2.code1, this.measType2, "2"))
      if( this.measType2.code2) {
        let serie2 = TimeSeries.createTimeSerie(this.measDevice, data, 'ts', this.measType2.code2, this.measType2, "2_1");
        if(!serie2.empty)
          rightSeries.push(serie2)
      }
    }

    this.chartData = {
      measurements: data,
      leftSeries: leftSeries,
      rightSeries: rightSeries
    }
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
    this.updateData()
  }

  onSelectedMeasurement2($event: MeasurementType) {
    this.measType2 = $event
    this.updateData()
  }
}
