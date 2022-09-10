import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {TopBarComponent} from './top-bar/top-bar.component';
import {ProfileComponent} from './profile/profile.component';
import {DeviceViewComponent} from './device-view/device-view.component';
import {ChartLegendComponent} from './chart-legend/chart-legend.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {RouterModule} from "@angular/router";
import {MatSortModule} from "@angular/material/sort";

const routes = [
  {path: '', component: ChartLegendComponent},
  {
    path: 'device-view',
    component: DeviceViewComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'chart-view-device',
    component: ChartViewDeviceComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'chart-view-time',
    component: ChartViewTimeComponent,
    canActivate: [MsalGuard]
  },
  {
    path: 'experiment',
    component: ChartExperimentComponent
  },
];

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1; // Remove this line to use Angular Universal

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {
  IPublicClientApplication,
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation,
  LogLevel
} from '@azure/msal-browser';
import {
  MsalGuard,
  MsalInterceptor,
  MsalBroadcastService,
  MsalInterceptorConfiguration,
  MsalService,
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalGuardConfiguration,
} from '@azure/msal-angular';
import {ChartViewDeviceComponent} from './chart-view-device/chart-view-device.component';
import {ChartMenuComponent } from './chart-menu/chart-menu.component';
import {ChartViewTimeComponent } from './chart-view-time/chart-view-time.component';
import {TimeChartComponent} from './time-chart/time-chart.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SerieCardComponent } from './chart-legend/serie-card/serie-card.component';
import {ChartExperimentComponent } from './chart-experiment/chart-experiment.component';
import {MatButtonModule} from "@angular/material/button";
import {environment} from "../environments/environment";

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.clientId, // PPE testing environment
      authority: `https://login.microsoftonline.com/${environment.tenantId}`,
      redirectUri: environment.baseUrl,
      postLogoutRedirectUri: '/'
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE, // set to true for IE 11. Remove this line to use Angular Universal
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Verbose,
        piiLoggingEnabled: false
      }
    }
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
  protectedResourceMap.set(`${environment.blobUrl}/weathersense-data`, ['https://storage.azure.com/.default']);
  protectedResourceMap.set(`${environment.iotHubUrl}/devices`, ['https://iothubs.azure.net/.default']);

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Popup,
    authRequest: {
      scopes: ['user.read']
    },
    loginFailedRoute: '/login-failed'
  };
}

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    ChartLegendComponent,
    DeviceViewComponent,
    ProfileComponent,
    ChartViewDeviceComponent,
    ChartMenuComponent,
    TimeChartComponent,
    SerieCardComponent,
    ChartExperimentComponent,
    ChartViewDeviceComponent,
    ChartViewTimeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    HttpClientModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
