import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { InjectionToken } from '@angular/core';
import { config } from 'rxjs';

export const APP_CONFIG = new InjectionToken<string>('app-config');

if (environment.production) {
  enableProdMode();
}

fetch('/assets/config.json')
.then(data => data.json())
.then(config => platformBrowserDynamic(
  [
    {
      provide: APP_CONFIG,
      useValue: config
    }
  ]).bootstrapModule(AppModule)
  .catch(err => console.error(err))
);
