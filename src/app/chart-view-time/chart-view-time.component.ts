import {Component, OnInit} from '@angular/core'
import {ChartData} from "../chart-data"
import {MeasurementType} from "../measurement-type"
import {IoTService} from "../iot.service"
import {DatePipe} from "@angular/common"
import {Measurement} from "../measurement"
import {TimeSeries} from "../timeseries"
import {ChartService} from "../chart.service"
import {catchError, of} from "rxjs";

@Component({
  selector: 'app-chart-view-time',
  templateUrl: './chart-view-time.component.html',
  styleUrls: ['./chart-view-time.component.css']
})
export class ChartViewTimeComponent implements OnInit {
  pipe = new DatePipe('en-US')
  private fmt: string = 'yyyyMMdd' // TODO refactor duplicates
  // TODO move this to the following structure:
  // chart/device-view
  // chart/time-view
  // chart/menu
  // chart/legend
  //...

  constructor(private iotService: IoTService, private chartService: ChartService) {
  }

  devices: string[] = [];
  measTypes: MeasurementType[] = this.iotService.getMeasurementTypes();
  visibleDevices: Set<string> = new Set();//= new Set(this.devices)

  measDate: string = this.pipe.transform(new Date(), this.fmt) ?? ""
  measType!: MeasurementType

  chartData: ChartData | undefined

  data: Record<string, Measurement[]> = {}
  numDataset = 0

  isMobileView = false

  ngOnInit(): void {
    let self = this;
    this.isMobileView = ( window.innerWidth <= 820);
    console.log("isMobile=" + this.isMobileView + " " + window.innerWidth);
    this.iotService.getDevices().subscribe({
      next(devs) {
        let devices = devs.map(d => d.id);
        self.devices = devices;
        console.log("got devices, ", devs, devices);
        self.readMeasurements(devices);
      }
    });

    this.chartService.chartEventListner().subscribe(msg => {
      console.log("chart view time got event:", msg)
      if (msg.eventType == 'hide') {
        this.visibleDevices.delete(msg.chartName!)
        this.updateVisibility()
      } else if (msg.eventType == 'show') {
        this.visibleDevices.add(msg.chartName!)
        this.updateVisibility()
      }
    })
  }

  private readMeasurements(devices: string[]) {
    console.log("readmeasurements: ", devices);
    this.data = {}
    this.numDataset = 0
    this.iotService.getMeasurementsMulti(devices, this.measDate)
      .pipe(catchError(() => of({})))
      .subscribe({
        next: (data) => {
          console.log("readmulti.next:", data);
          Object.assign(this.data, data)
          this.numDataset += 1
        },
        complete: () => {
          console.log('readmulti.complete=================');
          this.prepareDataAll();
        }
      });
  }


  private prepareDataAll() {
    let leftSeries: TimeSeries[] = []
    for (let i = 0; i < this.numDataset; i++) {
      if (this.data[this.devices[i]] !== undefined) {

        leftSeries.push(TimeSeries.createTimeSerie(this.devices[i], this.data[this.devices[i]], 'ts', this.measType.code1, this.measType, "" + (i + 1)))
        if (this.measType.code2) {
          let serie2 = TimeSeries.createTimeSerie(this.devices[i], this.data[this.devices[i]], 'ts', this.measType.code2, this.measType, "" + (i + 1) + "_1")
          if (!serie2.empty)
            leftSeries.push(serie2)
        }
      }
    }
    this.chartData = {
      leftSeries: leftSeries,
      rightSeries: []
    }
  }

  private updateData() {
    if (this.chartData) {
      this.prepareDataAll()
    } else {
      this.data = {}
    }
  }

  private updateVisibility() {
    if (this.chartData) {
      this.updateVisibilityArr(this.chartData.leftSeries)
      this.updateVisibilityArr(this.chartData.rightSeries)
      this.chartData = {
        leftSeries: this.chartData.leftSeries,
        rightSeries: this.chartData.rightSeries
      }
    }

  }

  private updateVisibilityArr(arr: TimeSeries[]) {
    for (let i = 0; i < arr.length; i++) {
      let series = arr[i]
      series.visible = this.visibleDevices.has(series.source);
    }
  }

  onMeasDate($event: Date) {
    this.measDate = this.pipe.transform($event, 'yyyyMMdd') ?? ""
    this.readMeasurements(this.devices)
  }

  onSelectedMeasurement($event: MeasurementType) {
    this.measType = $event
    this.updateData()
  }
}
