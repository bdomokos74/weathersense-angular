import {NgModule} from '@angular/core';
import {DeviceViewComponent} from "./device-view/device-view.component";
import {ProfileComponent} from "./profile/profile.component";
import {ChartViewDeviceComponent} from "./chart-view-device/chart-view-device.component";
import {ChartViewTimeComponent} from "./chart-view-time/chart-view-time.component";
import {ChartExperimentComponent} from "./chart-experiment/chart-experiment.component";
import {RouterModule} from "@angular/router";
import {BrowserUtils} from "@azure/msal-browser";
import {LoginFailedComponent} from "./login-failed/login-failed.component";
import {HomeComponent} from "./home/home.component";

const routes = [
  {path: '', component: HomeComponent},
  {path: 'login-failed', component: LoginFailedComponent},
  {path: 'device-view', component: DeviceViewComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'chart-view-device', component: ChartViewDeviceComponent},
  {path: 'chart-view-time', component: ChartViewTimeComponent},
  {path: 'experiment', component: ChartExperimentComponent},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "reload",
      initialNavigation: !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup() ? 'enabledNonBlocking' : 'disabled' // Set to enabledBlocking to use Angular Universal
    })
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
