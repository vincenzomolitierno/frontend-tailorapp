import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from "../material/material.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerGridComponent } from './customer-grid/customer-grid.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CuFormComponent as CustomerFormComponent } from './cu-form/cu-form.component';


@NgModule({
  declarations: [
    CustomerGridComponent, 
    CustomerFormComponent,    
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
  ],
  exports: [
    CustomerGridComponent,
  ],
  entryComponents: [
    CustomerFormComponent    
  ],
})
export class CustomersModule { }
