import {TimeSeries} from "./timeseries";
import {Measurement} from "./measurement";

export interface ChartData {
  leftSeries: TimeSeries[]
  rightSeries: TimeSeries[]
  measurements: Measurement[]
}
