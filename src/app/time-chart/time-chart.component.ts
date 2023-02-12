import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';
import {TimeSeries, Range} from "../timeseries";
import {ChartData} from "../chart-data";

@Component({
  selector: 'app-time-chart',
  templateUrl: './time-chart.component.html',
  styleUrls: ['./time-chart.component.css']
})
export class TimeChartComponent implements OnInit {
  private margin = {top: 45, bottom: 15, left: 85, right: 20};
  private width: number = 0;
  private height: number = 0;

  private viewInited: boolean = false;
  private outstandingData: boolean = false;
  private _chartData: ChartData|undefined = undefined;

  @ViewChild('svgcontainer') container! : ElementRef;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    console.log(`resize, ${event.target.innerWidth}, ${this.container.nativeElement.offsetWidth}`);
  }

  @Input()
  set chartData(chartData: ChartData|undefined) {
    this._chartData= chartData
    if (this.viewInited) {
      this.draw();
    } else {
      this.outstandingData = true;
    }
  }
  get chartData():ChartData|undefined {
    return this._chartData
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    console.log("ngAfterViewInit", this.container);
    console.log("svgContainer.nativeElement.offsetWidth: ", this.container.nativeElement.offsetWidth);
    if(this.outstandingData) {
      this.draw();
      this.outstandingData = false;
    }
    this.viewInited = true;
  }

  private draw(): void {
    console.log("calling draw", this.chartData);
    const width = this.container.nativeElement.offsetWidth;
    const height = 960;
    console.log(`container id: ${this.container.nativeElement}`)
    const svgContainer = d3.select(".svg-container");
    svgContainer.selectAll("*").remove();

    if(this.chartData===undefined ||(this.chartData.leftSeries.length==0&&this.chartData.rightSeries.length==0)) {
      return
    }

    const svg = svgContainer.append("svg:svg")
        .attr("width", width)
        .attr("height", height);

    this.width = +svg.attr("width") - this.margin.left - this.margin.right;
    this.height = +svg.attr("height") - this.margin.top - this.margin.bottom;

    const xRange:Range = {min: this.margin.left, max:this.width - this.margin.right};
    const yRange:Range = {min: this.height - this.margin.bottom, max: this.margin.top};

    console.log(`draw w=${this.width}, h=${this.height}`);

    let leftSeries: TimeSeries[] = []
    if(this.chartData.leftSeries) leftSeries = this.chartData.leftSeries
    let rightSeries: TimeSeries[] = []
    if(this.chartData.rightSeries) rightSeries = this.chartData.rightSeries


    // Compute default y-domain.
    let xDomain = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
    let yDomainLeft = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
    let yDomainRight = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
    for (const s of leftSeries) {
      console.log(`===>${s.code}: ${s.xDomain}, visible:${s.visible}`)
      if(s.visible) {
        xDomain[0] = Math.min(xDomain[0], s.xDomain[0])
        xDomain[1] = Math.max(xDomain[1], s.xDomain[1])
        let yDomain_0 = s.yDomain[0];
        let yDomain_1 = s.yDomain[1];
        console.log("y0, y1", yDomain_0, yDomain_1);
        if( !isNaN(yDomain_0) && !isNaN( yDomain_1)) {
          yDomainLeft[0] = Math.min(yDomainLeft[0], s.yDomain[0])
          yDomainLeft[1] = Math.max(yDomainLeft[1], s.yDomain[1])
        }
      }
    }

    if(leftSeries.length>0 && leftSeries[0].type.name==='Temperature')
      yDomainLeft[0] = Math.min(yDomainLeft[0], 10)

    console.log("ydomain:", yDomainLeft)

    for (const s of rightSeries) {
      if(s.visible) {
        xDomain[0] = Math.min(xDomain[0], s.xDomain[0])
        xDomain[1] = Math.max(xDomain[1], s.xDomain[1])
        yDomainRight[0] = Math.min(yDomainRight[0], s.yDomain[0])
        yDomainRight[1] = Math.max(yDomainRight[1], s.yDomain[1])
      }
    }

    if(rightSeries.length>0 && rightSeries[0].type.name==='Temperature') {
      yDomainRight[0] = Math.min(yDomainRight[0], 10)
    }

    const xScale = d3.scaleTime().domain(xDomain).range([xRange.min, xRange.max]);//.interpolate(d3.interpolateRound);
    const yScaleLeft = d3.scaleLinear().domain(yDomainLeft).range([yRange.min, yRange.max]);
    const yScaleRight = d3.scaleLinear().domain(yDomainRight).range([yRange.min, yRange.max]);

    for (const s of leftSeries) {
      s.setScales(xScale, yScaleLeft)
    }
    for (const s of rightSeries) {
      s.setScales(xScale, yScaleRight)
    }

    this.createAxisX(svg, xScale);
    this.createAxisY(svg, yScaleLeft, leftSeries[0].type.name, leftSeries[0].type.unit);
    if(rightSeries.length>0) {
      this.createAxisYRight(svg, yScaleRight, rightSeries[0].type.name, rightSeries[0].type.unit);
    }
    this.createTimeLine(svg, xScale)

    let i = 1
    for (const s of leftSeries) {
      if(s.visible)
      this.addLineGraph(svg, s, i++)
    }
    for (const s of rightSeries) {
      if(s.visible)
      this.addLineGraph(svg, s, i++)
    }
  }

  private addLineGraph(svg: any, s: TimeSeries, num: number) {
    svg.append("path")
      .data([s.measData])
      .attr("class", "line m"+s.color)
      .attr("d", s.getLineMethod())
  }

  private createAxisX(svg: any, xScale: any) {
    const xAxis = d3.axisBottom(xScale).ticks(this.width / 80, "%H:%M:%S").tickSizeOuter(0);

    svg.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${this.height - this.margin.bottom})`)
      .call(xAxis);

    svg.append("text")
      .attr("x", this.width / 2)
      .attr("y", this.height + 1.5*this.margin.bottom)
      .style("text-anchor", "middle")
      .text("Measurement Time");
  }


  private createAxisY(svg: any, yScale: any, label: string, unit: string) {
    const yAxis = d3.axisLeft(yScale).ticks(10, ".1f");
    svg.append("g")
      .attr("transform", `translate(${this.margin.left},0)`)
      .call(yAxis);

    svg.append("text")      // text label for the y-axis
      // .attr("data-test", "y-title")
      .attr("y", this.margin.left/2)
      .attr("x", 0)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "end")
      .text(`${label} (${unit})`);
  }

  private createAxisYRight(svg: any, yScale: any, label: string, unit: string) {
    const yAxis = d3.axisRight(yScale).ticks(10, ".0f");
    svg.append("g")
      .attr("transform", `translate(${this.width+this.margin.right},0)`)
      .call(yAxis);

    svg.append("text")      // text label for the y-axis
      // .attr("data-test", "y-title")
      .attr("y", this.width+this.margin.left)
      .attr("x", 0)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "end")
      .text(`${label} (${unit})`);
  }

  private createTimeLine(svg: any, xScale: any) {
    let currTime = new Date();
    let currX = xScale(currTime);

    svg
      .append('line')
      .attr('x1', currX)
      .attr('y1', this.height - this.margin.top)
      .attr('x2', currX)
      .attr('y2', this.margin.top)
      .style("stroke-width", 0.5)
      .style("stroke", "lightgreen")
      .style("fill", "none");
  }

}
