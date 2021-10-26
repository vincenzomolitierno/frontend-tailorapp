import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { ScriptService } from 'src/app/customers/customer-grid/script.service';
import server from "src/assets/setting/server.json";
import app_setting from "src/assets/setting/app-setting.json";

@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.css']
})
export class DashboardPanelComponent implements OnInit {

  private server;
  private app_setting

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public scriptService: ScriptService
  ) { 
    this.scriptService.load('pdfMake', 'vfsFonts');
    this.server = server;
    this.app_setting = app_setting;
  }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}

