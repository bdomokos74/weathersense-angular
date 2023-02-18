import {Component, Input, OnInit} from '@angular/core';
import {ChartData} from "../chart-data";
import {TimeSeries} from "../timeseries";

@Component({
  selector: 'app-chart-legend',
  templateUrl: './chart-legend.component.html',
  styleUrls: ['./chart-legend.component.css']
})
export class ChartLegendComponent implements OnInit {

  constructor() {
  }
  series: TimeSeries[] = []

  private _chartData: ChartData|undefined = undefined;
  @Input()
  set chartData(chartData: ChartData|undefined) {
    this._chartData= chartData
    let allSeries:TimeSeries[] = []

    if(chartData && chartData.rightSeries)
      allSeries = allSeries.concat(chartData.rightSeries)
    if(chartData && chartData.leftSeries)
      allSeries = allSeries.concat(chartData.leftSeries)

    allSeries = allSeries.filter( s => s.yDomain[0]!==undefined && s.yDomain[1]!== undefined);

    if(allSeries.length>0)
      this.series = allSeries
    console.log("allseries: ", allSeries)
  }
  get chartData():ChartData|undefined {
    return this._chartData
  }

  ngOnInit(): void {
  }
}
