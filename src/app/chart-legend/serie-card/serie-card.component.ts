import {Component, Input, OnInit} from '@angular/core';
import {TimeSeries} from "../../timeseries";

@Component({
  selector: 'app-serie-card',
  templateUrl: './serie-card.component.html',
  styleUrls: ['./serie-card.component.css']
})
export class SerieCardComponent implements OnInit {

  constructor() { }

  @Input()
  serie!: TimeSeries

  ngOnInit(): void {
  }

  getClass() {
    return `badge-sensor${this.serie.color} badge-border${this.serie.color}`;
  }
}

// https://css-tricks.com/snippets/css/complete-guide-grid/
// https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties
