import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubcontractorFormComponent } from './subcontractor-form/subcontractor-form.component';
import { SubcontractorsGridComponent } from './subcontractors-grid/subcontractors-grid.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    SubcontractorFormComponent, 
    SubcontractorsGridComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule
  ],
  exports: [
    SubcontractorsGridComponent
  ],
  entryComponents: [
    SubcontractorFormComponent
  ]
})
export class SubcontractorsModule { }
