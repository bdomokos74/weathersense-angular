
export interface Measurement {
  id: number|undefined,
  ts: Date,
  t1: number|undefined,
  t2: number|undefined,
  h: number,
  p: number
}

export type MeasKey = keyof Measurement;