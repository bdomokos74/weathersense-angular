import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLegendComponent } from './chart-legend.component';

describe('ChartLegendComponent', () => {
  let component: ChartLegendComponent;
  let fixture: ComponentFixture<ChartLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartLegendComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
