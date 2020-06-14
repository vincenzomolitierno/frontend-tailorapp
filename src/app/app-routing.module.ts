import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSigninComponent } from './login/login-signin/login-signin.component';
import { DashboardPanelComponent } from './dashboard/dashboard-panel/dashboard-panel.component';
import { HomeSubpanelComponent } from './dashboard/home-subpanel/home-subpanel.component';
import { ProfileSubpanelComponent } from './dashboard/profile-subpanel/profile-subpanel.component';
import { CustomersSubpanelComponent } from './dashboard/customers-subpanel/customers-subpanel.component';
import { SubcontractorsSubpanelComponent } from './dashboard/subcontractors-subpanel/subcontractors-subpanel.component';
import { OrdersSubpanelComponent } from './dashboard/orders-subpanel/orders-subpanel.component';
import { CatalogsSubpanelComponent } from './dashboard/catalogs-subpanel/catalogs-subpanel.component';
import { HelpdeskSubpanelComponent } from './dashboard/helpdesk-subpanel/helpdesk-subpanel.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginSigninComponent },
  { path: 'dashboard', 
    component: DashboardPanelComponent,
    children: [
      { path: '', component: HomeSubpanelComponent, pathMatch: 'full' },
      { path: 'customers', component: CustomersSubpanelComponent },
      { path: 'orders', component: OrdersSubpanelComponent },
      { path: 'subcontractors', component: SubcontractorsSubpanelComponent },
      { path: 'catalogs', component: CatalogsSubpanelComponent },
      { path: 'profile', component: ProfileSubpanelComponent },
      { path: 'helpdesk', component: HelpdeskSubpanelComponent },
      { path: 'logout', redirectTo: '/login' }
    ] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
