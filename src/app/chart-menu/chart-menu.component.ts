import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import * as moment from 'moment';
import {MeasurementType} from "../measurement-type";

@Component({
  selector: 'app-chart-menu',
  templateUrl: './chart-menu.component.html',
  styleUrls: ['./chart-menu.component.css']
})
export class ChartMenuComponent implements OnInit {
  constructor() { }

  @Input()
  showDeviceSelect: boolean = true;

  @Input()
  showMeasurement2Select: boolean = true;

  _devices: string[] = []
  @Input()
  get devices() {
    return this._devices
  }
  set devices(devices) {
    this._devices = devices
    this._selectedDevice = this._devices[0]
    this._selectedDevice2 = this._devices[0]
  }

  _measurements: MeasurementType[] = []
  @Input()
  get measurements() {
    return this._measurements;
  }
  set measurements(measurements) {
    this._measurements = measurements
    this._selectedMeasurement = this.measurements[0]
  }



  _measDate = new FormControl(new Date());
  @Output()
  measDate = new EventEmitter<Date>();



  selectedDeviceVal!: string;
  get _selectedDevice() {
    return this.selectedDeviceVal;
  }
  set _selectedDevice(value) {
    this.selectedDeviceVal = value;
    this.selectedDevice.emit(this.selectedDeviceVal);
  }
  @Output()
  selectedDevice = new EventEmitter<string>();


  selectedDeviceVal2!: string;
  get _selectedDevice2() {
    return this.selectedDeviceVal2;
  }
  set _selectedDevice2(value) {
    this.selectedDeviceVal2 = value;
    this.selectedDevice2.emit(this.selectedDeviceVal2);
  }
  @Output()
  selectedDevice2 = new EventEmitter<string>();



  selectedMeasurementVal!: MeasurementType
  get _selectedMeasurement() {
    return this.selectedMeasurementVal
  }
  set _selectedMeasurement(value) {
    this.selectedMeasurementVal = value
    this.selectedMeasurement.emit(this.selectedMeasurementVal);
  }
  @Output()
  selectedMeasurement = new EventEmitter<MeasurementType>();

  selectedMeasurementVal2: MeasurementType|undefined = undefined
  get _selectedMeasurement2() {
    return this.selectedMeasurementVal2
  }
  set _selectedMeasurement2(value) {
    this.selectedMeasurementVal2 = value
    this.selectedMeasurement2.emit(this.selectedMeasurementVal2);
  }
  @Output()
  selectedMeasurement2 = new EventEmitter<MeasurementType>();


  ngOnInit(): void {

  }

  onDateChage($event: any) {
    console.log("ondatechange!!")
    this.measDate.emit($event.value);
  }

  @HostListener('document:keydown', ['$event'])
  changeDateHotkey(event: any) {
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
