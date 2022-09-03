import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Measurement} from "../../measurement";
import * as d3 from 'd3';
import {MeasurementType} from "../../measurement-type";


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

  _measurements: Measurement[] = [];
  _measType!: MeasurementType;

  @ViewChild('svgcontainer') container! : ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    console.log(`resize, ${event.target.innerWidth}, ${this.container.nativeElement.offsetWidth}`);
  }

  @Input()
  set measurements(value: Measurement[]) {
    this._measurements = value;

    console.log("setting measurements, len", this._measurements.length);
      if (this.viewInited) {
        this.draw();
      } else {
        this.outstandingData = true;
      }
  }
  get measurements(): Measurement[] {
    return this._measurements;
  }


  @Input()
  set measurementType(value: MeasurementType) {
    this._measType = value
    console.log("meas change", value)
  }
  get measurementType() {
    return this._measType
  }


  constructor() { }

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
    console.log("calling draw");
    const width = this.container.nativeElement.offsetWidth;
    const height = 960;
    console.log(`container id: ${this.container.nativeElement}`)
    const svgContainer = d3.select(".svg-container");
    svgContainer.selectAll("*").remove();

    if(this._measurements.length==0) {
      return
    }

    const svg = svgContainer.append("svg:svg")
        .attr("width", width)
        .attr("height", height);

    console.log("svg", svg);
    this.width = +svg.attr("width") - this.margin.left - this.margin.right;
    this.height = +svg.attr("height") - this.margin.top - this.margin.bottom;

    console.log(`draw num meas:${this._measurements.length}, w=${this.width}, h=${this.height}`);

    // this.svg.selectAll("*").remove();

    let ts: any = (obj: any) => obj['ts'];
    let t1: any = (obj: any) => obj['t1'];
    let t2: any = (obj: any) => obj['t2'];
    const X: any = d3.map(this._measurements, ts);
    const Y1:any = d3.map(this._measurements, t1);
    const Y2:any = d3.map(this._measurements, t2);

    const defined = (d: any, i: any) => !isNaN(X[i]) && !isNaN(Y1[i])
    // const D = d3.map(this._measurements, defined);

    const xRange = [this.margin.left, this.width - this.margin.right];
    const yRange = [this.height - this.margin.bottom, this.margin.top];

    // Compute default y-domain.
    const xDomain: any = d3.extent(X);
    let yDomain1: any = d3.extent(Y1);
    let yDomain2: any = d3.extent(Y2);
    console.log("ydomains:", yDomain1, yDomain2)

    let yDomain
    if(yDomain1[0]==undefined) {
      yDomain1 = yDomain2
    } else if(yDomain2[0]==undefined) {
        yDomain2 = yDomain1
    }
    yDomain = [Math.min(yDomain1[0], yDomain2[0]), Math.max(yDomain1[1], yDomain2[1])];
    yDomain[0] = Math.min(yDomain[0], 10)
    console.log("ydomain:", yDomain)

    // Construct scales and axes.
    const xScale = d3.scaleTime().domain(xDomain).range(xRange);//.interpolate(d3.interpolateRound);
    const yScale = d3.scaleLinear().domain(yDomain).range(yRange);

    let line: any = d3.line()
      .defined(defined)
      // .curve(curve)
      .x(d => xScale(ts(d)))
      .y(d => yScale(t1(d)));

    let line2:any = d3.line()
      .defined(defined)
      // .curve(curve)
      .x(d => xScale(ts(d)))
      .y(d => yScale(t2(d)));


      const xAxis = d3.axisBottom(xScale).ticks(this.width / 80, "%H:%M:%S").tickSizeOuter(0);
      const yAxis = d3.axisLeft(yScale).ticks(null, "");

      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${this.height - this.margin.bottom})`)
        .call(xAxis);

      svg.append("text")
        .attr("x", this.width / 2)
        .attr("y", this.height + 1.5*this.margin.bottom)
        .style("text-anchor", "middle")
        .text("Measurement Time");

      svg.append("g")
        .attr("transform", `translate(${this.margin.left},0)`)
        .call(yAxis);

      svg.append("text")      // text label for the y-axis
        // .attr("data-test", "y-title")
        .attr("y", 120 - this.margin.left)
        .attr("x", 50 - (this.height / 2))
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "end")
        .text("t1 (°C)");

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


    if(this.measurements[0].t1) {
      svg.append("path")
        .data([this._measurements])
        .attr("class", "line m1")
        .attr("d", line)
        .style("stroke-width", 0.5)
        .style("stroke", "currentcolor")
        .style("fill", "none");
    }

    if(this.measurements[0].t2) {
      svg.append("path")
        .data([this._measurements])
        .attr("class", "line m3")
        .attr("d", line2)
        .style("stroke-width", 0.5)
        .style("stroke", "lightblue")
        .style("fill", "none");
    }
  }

}
