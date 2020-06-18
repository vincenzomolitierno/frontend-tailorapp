import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { ImageDrawingModule } from 'ngx-image-drawing';
import { ShirtMarksComponent } from './shirt-marks/shirt-marks.component';
import { MeasureFormComponent } from './measure-form/measure-form.component';

import { RemoveStringTime } from '../utilities/pipe-tools';
import { HostDirective } from './shirt-marks/myhost-directive';

@NgModule({
  declarations: [    
    ShirtMarksComponent,
    MeasureFormComponent,
    RemoveStringTime,
    HostDirective
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
    MeasureFormComponent
  ],
  exports: [
    MeasureFormComponent
  ]
})
export class MeasureModule { }
