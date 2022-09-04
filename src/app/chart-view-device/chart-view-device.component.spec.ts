import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ChartViewDeviceComponent} from "./chart-view-device.component";


describe('ChartViewDeviceComponent', () => {
  let component: ChartViewDeviceComponent;
  let fixture: ComponentFixture<ChartViewDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartViewDeviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartViewDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
