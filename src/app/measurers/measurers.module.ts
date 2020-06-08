import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasurersGridComponent } from './measurers-grid/measurers-grid.component';
import { MeasurerFormComponent } from './measurer-form/measurer-form.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    MeasurersGridComponent, 
    MeasurerFormComponent
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
    MeasurersGridComponent
  ],
  entryComponents: [
    MeasurerFormComponent
  ]
})
export class MeasurersModule { }
