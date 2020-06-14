import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionConfirmDummyComponent } from './action-confirm-dummy/action-confirm-dummy.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    ActionConfirmDummyComponent
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
    ActionConfirmDummyComponent    
  ],
})
export class UtilitiesModule { }
