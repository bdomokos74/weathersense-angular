import {MeasurementType} from "./measurement-type";
import {Measurement} from "./measurement";
import * as d3 from "d3";
import * as moment from 'moment';

export interface Range {
  min: number,
  max: number
}

export class TimeSeries {
  private tsMapper: any;
  private yMapper: any;
  private defined: any;
  private constructor(
    source: string,
    type: MeasurementType,
    xDomain: number[],
    yDomain: number[],
    tsMapper: any,
    yMapper: any,
    defined: any,
    code: string,
    empty: boolean,
    color: string,
    measData: Measurement[]
  )
  {
    this.source = source;
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
    this.measData = measData
  }
  private xScale: any;
  private yScale: any;

  measData: Measurement[]|undefined

  type: MeasurementType
  xDomain: number[]
  yDomain: number[]
  code: string
  empty: boolean
  color: string
  source: string
  yMin: string|undefined
  yMax: string|undefined
  yCurr: string|undefined
  yMinTime: string|undefined
  yMaxTime: string|undefined
  yCurrTime: string|undefined


  static createTimeSerie(source: string, measData: Measurement[], ts: string, code: string, type: MeasurementType, color: string) :TimeSeries {
    let tsMapper: any = (obj: any) => obj[ts];
    let yMapper: any = (obj: any) => obj[code];

    const X: number[] = d3.map(measData, tsMapper);

    const Y: number[] = d3.map(measData, yMapper);

    const defined = (d: any, i: any) => X[i]!==undefined && Y[i]!==undefined && !isNaN(Y[i])

    const xDomain: any = d3.extent(X);
    let yDomain: any = d3.extent(Y);



    // const xScale = d3.scaleTime().domain(xDomain).range([xRange.min, xRange.max]);//.interpolate(d3.interpolateRound);
    // const yScale = d3.scaleLinear().domain(yDomain).range([yRange.min, yRange.max]);

    let empty = Y.filter( (item: any) => item!=undefined).length==0

    let result = new TimeSeries(source, type, xDomain, yDomain, tsMapper, yMapper, defined, code, empty, color, measData);
    if(empty) return result

    let maxIndex = d3.maxIndex(Y)
    let minIndex = d3.minIndex(Y)
    let yMin = Y[minIndex]
    let yMax = Y[maxIndex]
    let yCurr = Y[Y.length-1]
    result.yMinTime = moment(X[minIndex]).format('HH:MM')
    result.yMaxTime = moment(X[maxIndex]).format('HH:MM')
    result.yCurrTime = moment(X[X.length-1]).format('HH:MM')

    let digits = 2
    if(type.name==='Pressure') {
      if(yMax>10000) {
        yMin /= 100
        yMax /= 100
        yCurr /= 100
      }
      digits = 0
    }
    result.yMin = yMin.toFixed(digits)
    result.yMax = yMax.toFixed(digits)
    result.yCurr = yCurr.toFixed(digits)
    return result
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

// https://observablehq.com/@d3/d3-line
