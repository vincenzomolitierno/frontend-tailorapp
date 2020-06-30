import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { ScriptService } from 'src/app/customers/customer-grid/script.service';

@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard-panel.component.html',
  styleUrls: ['./dashboard-panel.component.css']
})
export class DashboardPanelComponent implements OnInit {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public scriptService: ScriptService
  ) { 
    this.scriptService.load('pdfMake', 'vfsFonts');
  }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}

