import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './login/login.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RESTBackendService } from './backend-service/rest-backend.service';
import { ScriptService } from './customers/customer-grid/script.service';
import { PdfPrinterService } from './utilities/pdf-printer.service';
import { RefreshTokenService } from './authentication/refresh-token.service';

@NgModule({
  declarations: [
    AppComponent   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LoginModule,
    DashboardModule
    ],
  providers: [
    RESTBackendService,
    ScriptService,
    PdfPrinterService,
    RefreshTokenService
  ],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule { }
