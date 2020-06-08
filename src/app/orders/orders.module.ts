import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderFormComponent } from './order-form/order-form.component';
import { OrderGridComponent } from './order-grid/order-grid.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ShirtsModule } from '../shirts/shirts.module';
import { OrderViewComponent } from './order-view/order-view.component';

@NgModule({
  declarations: [
    OrderFormComponent, 
    OrderGridComponent, 
    OrderViewComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    ShirtsModule
  ],
  exports: [
    OrderGridComponent
  ],
  entryComponents: [
    OrderFormComponent,
    OrderViewComponent  
  ],
})
export class OrdersModule { }
