import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPanelComponent } from './dashboard-panel/dashboard-panel.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { HomeSubpanelComponent } from './home-subpanel/home-subpanel.component';
import { DummySubpanelComponent } from './dummy-subpanel/dummy-subpanel.component';
import { ProfileSubpanelComponent } from './profile-subpanel/profile-subpanel.component';
import { BrowserModule } from '@angular/platform-browser';
import { CustomersSubpanelComponent } from './customers-subpanel/customers-subpanel.component';
import { OrdersSubpanelComponent } from './orders-subpanel/orders-subpanel.component';
import { SubcontractorsSubpanelComponent } from './subcontractors-subpanel/subcontractors-subpanel.component';
import { CatalogsSubpanelComponent } from './catalogs-subpanel/catalogs-subpanel.component';
import { HelpdeskSubpanelComponent } from './helpdesk-subpanel/helpdesk-subpanel.component';
import { CustomersModule } from '../customers/customers.module';
import { MeasureModule } from '../measure/measure.module';
import { OrdersModule } from '../orders/orders.module';
import { SubcontractorsModule } from '../subcontractors/subcontractors.module';
import { MeasurersModule } from '../measurers/measurers.module';
import { CatalogsModule } from '../catalogs/catalogs.module';
import { UtilitiesModule } from '../utilities/utilities.module';

@NgModule({
  declarations: [
    DashboardPanelComponent, 
    HomeSubpanelComponent, 
    DummySubpanelComponent, 
    ProfileSubpanelComponent, 
    CustomersSubpanelComponent, 
    OrdersSubpanelComponent, 
    SubcontractorsSubpanelComponent, 
    CatalogsSubpanelComponent, 
    HelpdeskSubpanelComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserModule,
    CustomersModule,
    MeasureModule,
    OrdersModule,
    SubcontractorsModule,
    MeasurersModule,
    SubcontractorsModule,
    CatalogsModule,
    UtilitiesModule
  ]
})
export class DashboardModule { }
