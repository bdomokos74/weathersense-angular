import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartViewTimeComponent } from './chart-view-time.component';

describe('ChartViewTimeComponent', () => {
  let component: ChartViewTimeComponent;
  let fixture: ComponentFixture<ChartViewTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartViewTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartViewTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
