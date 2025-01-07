import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {provideNoopAnimations} from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService,
  MsalGuard,
  MsalGuardConfiguration,
  MsalInterceptor,
  MsalInterceptorConfiguration,
  MsalService,
} from '@azure/msal-angular';
import {MatButtonModule} from "@angular/material/button";
import {environment} from "../environments/environment";
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';

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

export function MSALInstanceFactory(): IPublicClientApplication {
    return new PublicClientApplication({
        auth: {
            clientId: environment.clientId,
            authority: environment.authority,
            redirectUri: '/',
            postLogoutRedirectUri: '/',
        },
        cache: {
            cacheLocation: BrowserCacheLocation.LocalStorage,
        },
        system: {
            allowNativeBroker: false, // Disables WAM Broker
            loggerOptions: {
                loggerCallback,
                logLevel: LogLevel.Info,
                piiLoggingEnabled: false,
            },
        },
    });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
    const protectedResourceMap = new Map<string, Array<string>>();

    protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['https://graph.microsoft.com/.default']); // Prod environment. Uncomment to use.
    //protectedResourceMap.set('https://graph.microsoft-ppe.com/v1.0/me', ['user.read']);
    protectedResourceMap.set(`${environment.blobUrl}/weathersense-config`, ['https://storage.azure.com/.default']);
    protectedResourceMap.set(`${environment.blobUrl}/weathersense-data`, ['https://storage.azure.com/.default']);
    protectedResourceMap.set(`device-view`, ['api://5ee20736-5cc8-4466-acac-fe2062a9a1a7/WS.Admin']);

    return {
        interactionType: InteractionType.Redirect,
        protectedResourceMap,
    };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
    return {
        interactionType: InteractionType.Redirect,
        authRequest: {
            scopes: [...'user.read'],
        },
        loginFailedRoute: '/login-failed',
    };
}


export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        importProvidersFrom(
            BrowserModule,
            MatButtonModule,
            MatToolbarModule,
        ),

        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi(), withFetch()),
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true,
        },
        {
            provide: MSAL_INSTANCE,
            useFactory: MSALInstanceFactory,
        },
        {
            provide: MSAL_GUARD_CONFIG,
            useFactory: MSALGuardConfigFactory,
        },
        {
            provide: MSAL_INTERCEPTOR_CONFIG,
            useFactory: MSALInterceptorConfigFactory,
        },
        MsalService,
        MsalGuard,
        MsalBroadcastService
    ]
};
