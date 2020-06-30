import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionConfirmDummyComponent } from './action-confirm-dummy/action-confirm-dummy.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MessageNotificationDummyComponent } from './message-notification-dummy/message-notification-dummy.component';

@NgModule({
  declarations: [
    ActionConfirmDummyComponent,
    MessageNotificationDummyComponent
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
    ActionConfirmDummyComponent,
    MessageNotificationDummyComponent    
  ],
})
export class UtilitiesModule { }
