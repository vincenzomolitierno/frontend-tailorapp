import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CuFormComponent as TakeMeasureFormComponent } from './cu-form/cu-form.component';

import { ImageDrawingModule } from 'ngx-image-drawing';
import { ShirtMarksComponent } from './shirt-marks/shirt-marks.component';

@NgModule({
  declarations: [    
    TakeMeasureFormComponent,
    ShirtMarksComponent  
],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    ImageDrawingModule    
  ],  
  entryComponents: [
    TakeMeasureFormComponent
  ],
  exports: [
    TakeMeasureFormComponent
  ]
})
export class MeasureModule { }
