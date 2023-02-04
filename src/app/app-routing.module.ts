import { NgModule } from '@angular/core';
import {DeviceViewComponent} from "./device-view/device-view.component";
import {MsalGuard} from "@azure/msal-angular";
import {ProfileComponent} from "./profile/profile.component";
import {ChartViewDeviceComponent} from "./chart-view-device/chart-view-device.component";
import {ChartViewTimeComponent} from "./chart-view-time/chart-view-time.component";
import {ChartExperimentComponent} from "./chart-experiment/chart-experiment.component";
import {RouterModule} from "@angular/router";
import {BrowserUtils} from "@azure/msal-browser";

const routes = [
  {path: '', component: ChartViewTimeComponent, canActivate: [MsalGuard]},
  {path: 'device-view', component: DeviceViewComponent, canActivate: [MsalGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [MsalGuard]},
  {path: 'chart-view-device', component: ChartViewDeviceComponent, canActivate: [MsalGuard]},
  {path: 'chart-view-time', component: ChartViewTimeComponent, canActivate: [MsalGuard]},
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
