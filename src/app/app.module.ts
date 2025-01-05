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
import {MatSortModule} from "@angular/material/sort";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {BrowserCacheLocation, InteractionType, LogLevel, PublicClientApplication,} from '@azure/msal-browser';
import {MsalBroadcastService, MsalGuard, MsalInterceptor, MsalModule, MsalService,} from '@azure/msal-angular';
import {ChartViewDeviceComponent} from './chart-view-device/chart-view-device.component';
import {ChartMenuComponent} from './chart-menu/chart-menu.component';
import {ChartViewTimeComponent} from './chart-view-time/chart-view-time.component';
import {TimeChartComponent} from './time-chart/time-chart.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SerieCardComponent} from './chart-legend/serie-card/serie-card.component';
import {ChartExperimentComponent} from './chart-experiment/chart-experiment.component';
import {MatButtonModule} from "@angular/material/button";
import {environment} from "../environments/environment";
import {AppRoutingModule} from './app-routing.module';
import { LoginFailedComponent } from './login-failed/login-failed.component';
import { HomeComponent } from './home/home.component';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

const protectedResourceMap = new Map<string, Array<string>>();
protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['https://graph.microsoft.com/.default']); // Prod environment. Uncomment to use.
//protectedResourceMap.set('https://graph.microsoft-ppe.com/v1.0/me', ['user.read']);
protectedResourceMap.set(`${environment.blobUrl}/weathersense-config`, ['https://storage.azure.com/.default']);
protectedResourceMap.set(`${environment.blobUrl}/weathersense-data`, ['https://storage.azure.com/.default']);
protectedResourceMap.set(`device-view`, ['api://5ee20736-5cc8-4466-acac-fe2062a9a1a7/WS.Admin']);

export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

@NgModule({ declarations: [
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
        ChartViewTimeComponent,
        LoginFailedComponent,
        HomeComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        AppRoutingModule,
        MsalModule.forRoot(new PublicClientApplication({
            auth: {
                clientId: environment.clientId, // PPE testing environment
                authority: `https://login.microsoftonline.com/${environment.tenantId}`, //
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
        }), {
            interactionType: InteractionType.Popup,
            authRequest: {
                scopes: ['user.read']
            },
            loginFailedRoute: '/login-failed'
        }, {
            interactionType: InteractionType.Popup,
            protectedResourceMap
        })], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true
        },
        MsalService,
        MsalGuard,
        MsalBroadcastService,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {}
