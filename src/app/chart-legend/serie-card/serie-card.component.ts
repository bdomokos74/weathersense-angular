import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TimeSeries} from "../../timeseries";
import {ChartService} from "../../chart.service";

@Component({
  selector: 'app-serie-card',
  templateUrl: './serie-card.component.html',
  styleUrls: ['./serie-card.component.css']
})
export class SerieCardComponent implements OnInit {

  constructor(private chartService: ChartService) { }

  @Input()
  serie!: TimeSeries

  grayedOut = false

  ngOnInit(): void {
    this.chartService.chartEventListner().subscribe( msg => {
      if(this.serie.source == msg.chartName) {
        console.log(`card ${this.serie.source} got event: ${msg.chartName}->${msg.eventType}`)
        if(msg.eventType==='hide') {
          this.grayedOut = true
        } if(msg.eventType==='show') {
          this.grayedOut = false
        }
      }
    })
  }

  headerClicked() {
    console.log(`headerClicked ${this.grayedOut}`)
    this.grayedOut = !this.grayedOut
    console.log(`headerClicked ${this.grayedOut}`)
    if(this.grayedOut) {
      this.chartService.emitChartEvent({eventType: 'hide', chartName: this.serie.source})
    } else {
      this.chartService.emitChartEvent({eventType: 'show', chartName: this.serie.source})
    }
  }
}

// https://css-tricks.com/snippets/css/complete-guide-grid/
// https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
