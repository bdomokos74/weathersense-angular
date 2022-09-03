import {MeasurementType} from "./measurement-type";
import {Measurement} from "./measurement";
import * as d3 from "d3";

export interface Range {
  min: number,
  max: number
}

export class TimeSeries {
  private tsMapper: any;
  private yMapper: any;
  private defined: any;
  private constructor(type: MeasurementType,
                      xDomain: number[],
                      yDomain: number[],
                      tsMapper: any,
                      yMapper: any,
                      defined: any,
                      code: string,
                      empty: boolean,
                      color: string
  )
  {
    this.type = type;
    this.xDomain = xDomain;
    this.yDomain = yDomain;
    this.tsMapper = tsMapper;
    this.yMapper = yMapper;
    this.defined = defined;
    this.empty = empty;
    this.color = color;

    this.xScale = undefined
    this.yScale = undefined
    this.code = code
  }
  private xScale: any;
  private yScale: any;

  type: MeasurementType
  xDomain: number[]
  yDomain: number[]
  code: string
  empty: boolean
  color: string

  static createTimeSerie(measData: Measurement[], ts: string, code: string, type: MeasurementType, color: string) :TimeSeries {
    let tsMapper: any = (obj: any) => obj[ts];
    let yMapper: any = (obj: any) => obj[code];

    const X: number[] = d3.map(measData, tsMapper);
    const Y: number[] = d3.map(measData, yMapper);

    const defined = (d: any, i: any) => !isNaN(X[i]) && !isNaN(Y[i])

    const xDomain: any = d3.extent(X);
    let yDomain: any = d3.extent(Y);

    // const xScale = d3.scaleTime().domain(xDomain).range([xRange.min, xRange.max]);//.interpolate(d3.interpolateRound);
    // const yScale = d3.scaleLinear().domain(yDomain).range([yRange.min, yRange.max]);

    let empty = Y.filter( (item: number) => item!=undefined).length==0

    return new TimeSeries(type, xDomain, yDomain, tsMapper, yMapper, defined, code, empty, color);
  }

  setScales(xScale: any, yScale: any) {
    this.xScale = xScale
    this.yScale = yScale

  }
  getLineMethod() {
    return d3.line()
      .defined(this.defined)
      // .curve(curve)
      .x(d => this.xScale(this.tsMapper(d)))
      .y(d => this.yScale(this.yMapper(d)));
  }
}
