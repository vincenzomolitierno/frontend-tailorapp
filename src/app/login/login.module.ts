import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRecoveryComponent } from './login-recovery/login-recovery.component';
import { LoginSigninComponent } from './login-signin/login-signin.component';
import { MaterialModule } from "../material/material.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginRecoveryComponent,
    LoginSigninComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    LoginSigninComponent
  ]
})
export class LoginModule { }
