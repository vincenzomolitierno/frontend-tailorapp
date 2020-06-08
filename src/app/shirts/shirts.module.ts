import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShirtsGridComponent } from './shirts-grid/shirts-grid.component';
import { ShirtFormComponent } from './shirt-form/shirt-form.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    ShirtsGridComponent, 
    ShirtFormComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
  ],
  entryComponents: [
    ShirtFormComponent    
  ],
  exports: [
    ShirtsGridComponent
  ]
})
export class ShirtsModule { }
