import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartExperimentComponent } from './chart-experiment.component';

describe('ChartExperimentComponent', () => {
  let component: ChartExperimentComponent;
  let fixture: ComponentFixture<ChartExperimentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartExperimentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartExperimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
