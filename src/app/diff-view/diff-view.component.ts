import {Component, OnInit} from '@angular/core';
import {MeasKey, Measurement} from "../common/model/measurement";
import {IoTService} from "../common/services/iot.service";
import {CommonModule, DatePipe} from "@angular/common";
import {MeasurementType} from "../common/model/measurement-type";
import {TimeSeries} from "../common/timeseries";
import {ChartData} from "../common/model/chart-data";
import { ChartMenuComponent } from '../common/chart/menu/chart-menu.component';
import { TimeChartComponent } from '../common/chart/time-chart/time-chart.component';
import { ChartLegendComponent } from '../common/chart/legend/chart-legend.component';

@Component({
  selector: 'app-diff-view',
  templateUrl: './diff-view.component.html',
  styleUrls: ['./diff-view.component.css'],
  standalone: true,
  imports: [
    ChartMenuComponent,
    ChartLegendComponent,
    TimeChartComponent,
    CommonModule
  ]
})
export class DiffViewComponent implements OnInit {
  pipe = new DatePipe('en-US');
  private fmt: string = 'yyyyMMdd';

  chartData: ChartData | undefined;

  //measurements: Measurement[] = [];

  data: Record<string, Measurement[]> = {}

  devices: string[] = []
  measTypes: MeasurementType[] = this.iotService.getMeasurementTypes()

  measDate: string = this.pipe.transform(new Date(), this.fmt) ?? "";

  measDevice: string|null = null;
  measDevice2: string|null = null;

  measType!: MeasurementType
  measType2: MeasurementType | undefined = undefined

  isMobileView = false

  constructor(private iotService: IoTService) {
  }

  ngOnInit() {
    let self = this;
    console.log("ngOnInit");
    this.isMobileView = ( window.innerWidth <= 820);
    this.iotService.getDevices().subscribe({
      next(devs) {
        console.log("got devices: ", devs);
        self.devices = devs.map(d => d.id);
        self.measDevice = self.devices[0]
        self.readMeasurements(self.getDevs());
      },
      complete() {
        console.log("getdevices done");
      }
    });
    //this.readMeasurements();
  }

  private readMeasurements(devs: string[]) {
    let self = this
    this.iotService.getMeasurementsMulti(devs, this.measDate)
      .subscribe({
          next(data) {
            console.log("subs data:", data)
            Object.assign(self.data, data)
            //self.measurements = data[measDevice]
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
    //let data = this.measurements;
    let leftSeries: TimeSeries[] = []
    let rightSeries: TimeSeries[] = []
    if (this.measDevice == null) {
      return;
    }
    leftSeries.push(TimeSeries.createTimeSerie(this.measDevice, this.data[this.measDevice], 'ts', this.measType.code1 as MeasKey, this.measType, "1"));
    if (this.measType.code2) {
      let serie2 = TimeSeries.createTimeSerie(this.measDevice, this.data[this.measDevice], 'ts', this.measType.code2 as MeasKey, this.measType, "1_1");
      if (!serie2.empty)
        leftSeries.push(serie2)
    }

    if (this.measType2 && this.measDevice2) {
      rightSeries.push(TimeSeries.createTimeSerie(this.measDevice2, this.data[this.measDevice2], 'ts', this.measType2.code1 as MeasKey, this.measType2, "2"))
      if (this.measType2.code2) {
        let serie2 = TimeSeries.createTimeSerie(this.measDevice2, this.data[this.measDevice2], 'ts', this.measType2.code2 as MeasKey, this.measType2, "2_1");
        if (!serie2.empty)
          rightSeries.push(serie2)
      }
    }

    this.chartData = {
      leftSeries: leftSeries,
      rightSeries: rightSeries
    }
  }

  getDevs(): string[] {

    let devs: string[] = [];
    if(this.measDevice) {
      devs.push(this.measDevice);
    }
    if(this.measDevice2) {
      devs.push(this.measDevice2);
    }
    return devs;
  }

  onMeasDate($event: Date) {
    if (this.measDevice == null) {
      return;
    }
    this.measDate = this.pipe.transform($event, 'yyyyMMdd') ?? "";
    this.readMeasurements(this.getDevs())
  }

  onSelectedDevice($event: string) {
    console.log("device change: ", $event)
    this.measDevice = $event
    this.readMeasurements(this.getDevs())
  }

  onSelectedDevice2($event: string) {
    console.log("device2 change: ", $event)
    this.measDevice2 = $event
    this.readMeasurements(this.getDevs())
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
