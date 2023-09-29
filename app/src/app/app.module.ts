import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalModule, MsalRedirectComponent, MsalService } from "@azure/msal-angular";
import { BrowserCacheLocation, IPublicClientApplication, InteractionType, LogLevel, PublicClientApplication } from "@azure/msal-browser";
import { AppConfigurationService } from "./app-configuration.service";
import { AppComponent } from "./app.component";
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginFailedComponent } from './login-failed/login-failed.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';


export function msalInstanceFactory(appConfig: any): IPublicClientApplication {
  const msalConfig = appConfig.appConfig.msal;

  return new PublicClientApplication({
    auth: {
      clientId: msalConfig.clientId,
      authority: msalConfig.authority,
      redirectUri: msalConfig.redirectUri,
      postLogoutRedirectUri: msalConfig.postLogoutRedirectUri,
      knownAuthorities: msalConfig.knownAuthorities
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage
    },
    system: {
      allowNativeBroker: false,
      loggerOptions: {
        loggerCallback: (level, message) => console.log(message),
        logLevel: LogLevel.Info,
        piiLoggingEnabled: true
      }
    }
  });
}

export function msalGuardConfigFactory(appConfig: any): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: []
    },
  //  loginFailedRoute: 'login-failed'
  }
}

// export function msalInterceptorConfigFactory(appConfig: any) : MsalInterceptorConfiguration {
//   const protectedResourceMap = new Map<string, Array<string>>();
//   //protectedResourceMap.set('https://localhost:7204', ['https://toniqb2ctest.onmicrosoft.com/toniqcdregisterapidev/user_impersonation'])
//   return {
//     interactionType: InteractionType.Redirect,
//     protectedResourceMap: protectedResourceMap,
//     authRequest: {
//       authority: 'https://toniqb2ctest.b2clogin.com/toniqb2ctest.onmicrosoft.com/B2C_1_CDRegister_SignIn'
//     }
//   }
// }

@NgModule({
  declarations: [AppComponent, LoginFailedComponent, LayoutComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'login-failed',
        component: LoginFailedComponent
      },
      {
        path: '',
        component: LayoutComponent,
        loadChildren: () => import('src/app/core/core.module').then(m => m.CoreModule),
        canActivate: [MsalGuard]
      }
    ]),
    HttpClientModule,
    MsalModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers:[
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      deps: [AppConfigurationService],
      useFactory: msalInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      deps: [AppConfigurationService],
      useFactory: msalGuardConfigFactory
    },
    // {
    //   provide: MSAL_INTERCEPTOR_CONFIG,
    //   deps: [AppConfigurationService],
    //   useFactory: msalInterceptorConfigFactory
    // },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule {}
