import { Component, OnInit } from '@angular/core';
import {ChartData} from "../chart-data";
import {MeasurementType} from "../measurement-type";
import {IoTService} from "../iot.service";
import {DatePipe} from "@angular/common";
import {Measurement} from "../measurement";
import {TimeSeries} from "../timeseries";

@Component({
  selector: 'app-chart-view-time',
  templateUrl: './chart-view-time.component.html',
  styleUrls: ['./chart-view-time.component.css']
})
export class ChartViewTimeComponent implements OnInit {
  pipe = new DatePipe('en-US');
  private fmt: string = 'yyyyMMdd'; // TODO refactor duplicates
  // TODO move this to the following structure:
  // chart/device-view
  // chart/time-view
  // chart/menu
  // chart/legend
  //...

  constructor(private iotService: IoTService) { }

  chartData: ChartData|undefined;

  devices = this.iotService.getDevices()
  measTypes: MeasurementType[] = this.iotService.getMeasurementTypes()

  measDate: string = this.pipe.transform(new Date(), this.fmt) ?? "";
  measDevice = this.devices[0];

  measType!: MeasurementType

  //measurements: Measurement[] = [];
  data: Record<string, Measurement[]> = {};
  numDataset = 0

  ngOnInit(): void {
    this.readMeasurements()
  }

  // TODO continue here
  // 1. add reading of data to iotservice, for today, all devices
  // 2. create timeseries based on that data
  private readMeasurements() {
    let self = this
    this.data = {}
    this.numDataset =0
    this.iotService.getMeasurementsMulti(this.devices, this.measDate)
      .subscribe(
        data => {

          Object.assign(this.data, data)
          this.numDataset += 1
        },
        err => {
          console.log("error:", err);
          self.data = {}
        },
        () => {
          self.prepareDataAll()
          console.log('done reading data=================');
        }
      );
  }

  private prepareDataAll() {
    let leftSeries: TimeSeries[] = []
    for (let i = 0; i < this.numDataset; i++) {
      leftSeries.push( TimeSeries.createTimeSerie(this.devices[i], this.data[this.devices[i]], 'ts', this.measType.code1, this.measType, ""+(i+1)))
      if( this.measType.code2) {
        let serie2 = TimeSeries.createTimeSerie(this.devices[i], this.data[this.devices[i]], 'ts', this.measType.code2, this.measType, ""+(i+1)+"_1");
        if(!serie2.empty)
          leftSeries.push(serie2)
      }
    }
    this.chartData = {
      leftSeries: leftSeries,
      rightSeries: []
    }
  }

  private updateData() {
    if(this.chartData) {
      this.prepareDataAll()
    } else {
      this.data = {}
    }
  }

  onMeasDate($event: Date) {
    this.measDate = this.pipe.transform($event, 'yyyyMMdd') ?? "";
    this.readMeasurements()
  }

  onSelectedMeasurement($event: MeasurementType) {
    this.measType = $event
    this.updateData()
  }
}
