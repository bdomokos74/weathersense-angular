import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Measurement} from "../measurement";
import {IoTService} from "../iot.service";

@Component({
  selector: 'app-chart-view-time',
  templateUrl: './chart-view-time.component.html',
  styleUrls: ['./chart-view-time.component.css']
})
export class ChartViewTimeComponent implements OnInit {
  measurements: Measurement[] = [];

  constructor(private http: HttpClient, private iotService: IoTService) {
  }

  ngOnInit() {
    console.log("ngOnInit");
    this.iotService.getMeasurements("DOIT1", "20220828")
      .subscribe(data => this.measurements = data);
  }

}
