import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TimeSeries} from "../../../timeseries";
import {ChartService} from "../../../services/chart.service";
import {CommonModule, NgClass} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-serie-card',
  templateUrl: './serie-card.component.html',
  styleUrls: ['./serie-card.component.css'],
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule
  ]
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
