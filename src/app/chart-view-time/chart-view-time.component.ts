import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-chart-view-time',
  templateUrl: './chart-view-time.component.html',
  styleUrls: ['./chart-view-time.component.css']
})
export class ChartViewTimeComponent implements OnInit {

  constructor(private http: HttpClient
  ) { }

  ngOnInit() {
    this.getBlob();
  }

  getBlob() {
    console.log("calling getblob");
    this.http.get("/blob/weathersense-data/meas-DOIT2-20220810.txt", {headers: {"x-ms-version": "2020-04-08"}})
      .subscribe(blob => {
        console.log("blob:", blob);
      });
  }

}
