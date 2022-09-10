import {Injectable} from "@angular/core"
import {BehaviorSubject, Observable} from "rxjs"

export interface ChartEvent {
  eventType: 'show'|'hide'|'none',
  chartName: string|undefined
}

@Injectable({providedIn: 'root'})
export class ChartService {
  private chartSubject = new BehaviorSubject<ChartEvent>({eventType: 'none', chartName: undefined})

  emitChartEvent(msg: ChartEvent){
    this.chartSubject.next(msg)
  }

  chartEventListner(): Observable<ChartEvent> {
    return this.chartSubject.asObservable()
  }

}
