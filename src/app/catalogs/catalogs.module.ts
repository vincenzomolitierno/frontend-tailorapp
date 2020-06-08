import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NeckmodelsGridComponent } from './neckmodels-grid/neckmodels-grid.component';
import { NeckmodelFormComponent } from './neckmodel-form/neckmodel-form.component';
import { WristmodelFormComponent } from './wristmodel-form/wristmodel-form.component';
import { WristmodelsGridComponent } from './wristmodels-grid/wristmodels-grid.component';
import { ForwardsidemodelsGridComponent } from './forwardsidemodels-grid/forwardsidemodels-grid.component';
import { ForwardsidemodelFormComponent } from './forwardsidemodel-form/forwardsidemodel-form.component';
import { BacksidemodelFormComponent } from './backsidemodel-form/backsidemodel-form.component';
import { BacksidemodelsGridComponent } from './backsidemodels-grid/backsidemodels-grid.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    NeckmodelsGridComponent, 
    NeckmodelFormComponent, 
    WristmodelFormComponent, 
    WristmodelsGridComponent, 
    ForwardsidemodelsGridComponent, 
    ForwardsidemodelFormComponent, 
    BacksidemodelFormComponent, 
    BacksidemodelsGridComponent
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
    NeckmodelsGridComponent, 
    WristmodelsGridComponent, 
    ForwardsidemodelsGridComponent, 
    BacksidemodelsGridComponent    

  ],
  entryComponents: [
    NeckmodelFormComponent, 
    WristmodelFormComponent, 
    ForwardsidemodelFormComponent, 
    BacksidemodelFormComponent
  ]
})
export class CatalogsModule { }
