import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG } from 'src/main';

@Injectable({
  providedIn: 'root'
})
export class AppConfigurationService {

  constructor(
    @Inject(APP_CONFIG) public appConfig: any
  ) { }
}
