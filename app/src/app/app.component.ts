import { HttpClient } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Component } from '@angular/core';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { EventType, InteractionStatus } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
  <ng-container *ngIf="!isIframe">
    <router-outlet></router-outlet>
  </ng-container>
  `,
})
export class AppComponent {
  public isIframe = false
  private readonly _destroying$ = new Subject<void>();
  public loginDisplay: boolean = false;

  constructor(
    private authService: MsalService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalBroadcastService: MsalBroadcastService
  ) {

  }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;
    this.setLoginDisplay();
    this.authService.instance.enableAccountStorageEvents();

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED
        )
      )
      .subscribe((result) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = '/';
        } else {
          this.setLoginDisplay();
        }
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        //this.store.dispatch(fetchUser());
        this.setLoginDisplay();
        this.checkAndSetActiveAccount();
      });
    //this.httpClient.get('/api/echo/resource?param1=sample').subscribe(data => console.log(data));
    //this.httpClient.get('/api/products/v1/products?store_id=BCH768&last_modified=2023-03-01T6:00%2B12:00').subscribe(data => console.log(data))
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  private setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  private checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();
    console.log(activeAccount);

    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      let accounts = this.authService.instance.getAllAccounts();
      // add your code for handling multiple accounts here
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }
}
