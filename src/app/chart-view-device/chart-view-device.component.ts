import {Component, OnInit} from '@angular/core';
import {Measurement} from "../measurement";
import {IoTService} from "../iot.service";
import {DatePipe} from "@angular/common";
import {MeasurementType} from "../measurement-type";
import {TimeSeries} from "../timeseries";
import {ChartData} from "../chart-data";

@Component({
  selector: 'app-chart-view-device',
  templateUrl: './chart-view-device.component.html',
  styleUrls: ['./chart-view-device.component.css']
})
export class ChartViewDeviceComponent implements OnInit {
  pipe = new DatePipe('en-US');
  private fmt: string = 'yyyyMMdd';

  chartData: ChartData | undefined;

  measurements: Measurement[] = [];

  devices: string[] = []
  measTypes: MeasurementType[] = this.iotService.getMeasurementTypes()

  measDate: string = this.pipe.transform(new Date(), this.fmt) ?? "";
  measDevice: string|null = null;

  measType!: MeasurementType
  measType2: MeasurementType | undefined = undefined

  constructor(private iotService: IoTService) {
  }

  ngOnInit() {
    let self = this;
    console.log("ngOnInit");
    this.iotService.getDevices().subscribe({
      next(devs) {
        console.log("got devices: ", devs);
        self.devices = devs.map(d => d.id);
        self.measDevice = self.devices[0]
        self.readMeasurements(self.measDevice);
      },
      complete() {
        console.log("getdevices done");
      }
    });
    //this.readMeasurements();
  }

  private readMeasurements(measDevice: string) {
    let self = this
    this.iotService.getMeasurements(measDevice, this.measDate)
      .subscribe({
          next(data) {
            console.log("subs data:", data)
            self.measurements = data[measDevice]
          },
          error(err) {
            console.log("error:", err)
            self.measurements = []
          },
          complete() {
            console.log('complete');
            self.prepareData();
          }
        }
      );
  }

  private updateData() {
    if (this.chartData) {
      //this.measurements = this.chartData.measurements
      this.prepareData()
    } else {
      //this.measurements = []
    }
  }

  private prepareData() {
    let data = this.measurements;
    let leftSeries: TimeSeries[] = []
    let rightSeries: TimeSeries[] = []
    if (this.measDevice == null) {
      return;
    }
    leftSeries.push(TimeSeries.createTimeSerie(this.measDevice, data, 'ts', this.measType.code1, this.measType, "1"));
    if (this.measType.code2) {
      let serie2 = TimeSeries.createTimeSerie(this.measDevice, data, 'ts', this.measType.code2, this.measType, "1_1");
      if (!serie2.empty)
        leftSeries.push(serie2)
    }

    if (this.measType2) {
      rightSeries.push(TimeSeries.createTimeSerie(this.measDevice, data, 'ts', this.measType2.code1, this.measType2, "2"))
      if (this.measType2.code2) {
        let serie2 = TimeSeries.createTimeSerie(this.measDevice, data, 'ts', this.measType2.code2, this.measType2, "2_1");
        if (!serie2.empty)
          rightSeries.push(serie2)
      }
    }

    this.chartData = {
      leftSeries: leftSeries,
      rightSeries: rightSeries
    }
  }

  onMeasDate($event: Date) {
    if (this.measDevice == null) {
      return;
    }
    this.measDate = this.pipe.transform($event, 'yyyyMMdd') ?? "";
    this.readMeasurements(this.measDevice)
  }

  onSelectedDevice($event: string) {
    console.log("device change: ", $event)
    this.measDevice = $event
    this.readMeasurements(this.measDevice)
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
