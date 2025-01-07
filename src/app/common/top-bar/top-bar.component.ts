import { CommonModule } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule, MatToolbarRow } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import {MsalBroadcastService, MsalService} from "@azure/msal-angular";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  standalone: true,
  imports: [
    RouterModule,
    MatLabel,
    MatIconModule,
    MatToolbarModule,
    MatToolbarRow,
    CommonModule
  ]
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
