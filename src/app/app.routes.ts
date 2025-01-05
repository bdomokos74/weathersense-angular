import { ChartExperimentComponent } from "./chart-experiment/chart-experiment.component";
import { ChartViewDeviceComponent } from "./chart-view-device/chart-view-device.component";
import { ChartViewTimeComponent } from "./chart-view-time/chart-view-time.component";
import { DeviceViewComponent } from "./device-view/device-view.component";
import { HomeComponent } from "./home/home.component";
import { LoginFailedComponent } from "./login-failed/login-failed.component";
import { ProfileComponent } from "./profile/profile.component";

export const routes = [
  {path: '', component: HomeComponent},
  {path: 'login-failed', component: LoginFailedComponent},
  {path: 'device-view', component: DeviceViewComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'chart-view-device', component: ChartViewDeviceComponent},
  {path: 'chart-view-time', component: ChartViewTimeComponent},
  {path: 'experiment', component: ChartExperimentComponent},
];