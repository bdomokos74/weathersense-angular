import {Component, OnInit} from '@angular/core';
import {MsalBroadcastService, MsalService} from "@azure/msal-angular";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {
  isIframe = false;

  loginDisplay = false;

  constructor(private broadcastService: MsalBroadcastService, private authService: MsalService) { }

  ngOnInit() {
    this.isIframe = window !== window.parent && !window.opener;
    this.setLoginDisplay()
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  login() {
    this.authService.loginPopup()
      .subscribe({
        next: (result) => {
          console.log("result = ", result);
          this.setLoginDisplay();
        },
        error: (error) => console.log(error)
      });
  }
}
