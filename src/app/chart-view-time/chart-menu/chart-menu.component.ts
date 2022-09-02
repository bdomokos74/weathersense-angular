import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import * as moment from 'moment';

@Component({
  selector: 'app-chart-menu',
  templateUrl: './chart-menu.component.html',
  styleUrls: ['./chart-menu.component.css']
})
export class ChartMenuComponent implements OnInit {
  constructor() { }

  _measDate = new FormControl(new Date());

  selectedDeviceVal!: string;
  get _selectedDevice() {
    return this.selectedDeviceVal;
  }
  set _selectedDevice(value) {
    this.selectedDeviceVal = value;
    this.selectedDevice.emit(this.selectedDeviceVal);
  }

  @Input()
  devices!: string[]

  @Output()
  measDate = new EventEmitter<Date>();

  @Output()
  selectedDevice = new EventEmitter<string>();

  ngOnInit(): void {
    this._selectedDevice = this.devices[0]
  }

  onDateChage($event: any) {
    console.log("ondatechange!!")
    this.measDate.emit($event.value);
  }

  @HostListener('document:keydown', ['$event'])
  doSomething(event: any) {
    let change: number|undefined = undefined
    if (event.key === 'ArrowLeft') {
      change = -1
    } else if (event.key === 'ArrowRight') {
      change = 1
    }
    if(change) {
      let d = moment(this._measDate.getRawValue(), 'YYYYMMDD').add(change, 'day')
      let date = new Date(d.format('MM/DD/YYYY'));
      this._measDate.setValue(date)
      console.log("left newdate", this.measDate)
      this.measDate.emit(date);
    }
  }
}
