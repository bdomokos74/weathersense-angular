import {DiffViewComponent} from "./diff-view/diff-view.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {DevicesViewComponent} from "./devices-view/devices-view.component";
import {LoginFailedComponent} from "./common/login-failed/login-failed.component";
import {ProfileComponent} from "./profile/profile.component";

export const routes = [
  {path: '', component: DashboardComponent},
  {path: 'login-failed', component: LoginFailedComponent},
  {path: 'device-view', component: DevicesViewComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'diff-view', component: DiffViewComponent},
  {path: 'dashboard', component: DashboardComponent}
];
