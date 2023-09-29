import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  public title = 'Toniq Web'
  public loginDisplay = false;

  constructor(private authService: MsalService) {}

  ngOnInit() {
    this.setLoginDisplay();
  }

  public logout() {
    this.authService.logout();
  }

  private setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  public changeFacility() {
    console.log('changeFacility');
  }
}
