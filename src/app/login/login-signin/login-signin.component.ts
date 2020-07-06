import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { MessageNotificationDummyComponent } from 'src/app/utilities/message-notification-dummy/message-notification-dummy.component';


@Component({
  selector: 'app-login-signin',
  templateUrl: './login-signin.component.html',
  styleUrls: ['./login-signin.component.css']
})
export class LoginSigninComponent implements OnInit {

  hide = true;

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  errorMessage: string;

  constructor( 
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
          this.router.navigate(['/dashboard']);
      }       
     }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';    
    this.returnUrl = '/dashboard';
  }

  // form: FormGroup = new FormGroup({
  //   username: new FormControl(''),
  //   password: new FormControl(''),
  // });

  // convenience getter for easy access to form fields
  get f() { 
     return this.loginForm.controls; 
  }  

  submit() {

    this.errorMessage = '';
    
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      console.log('Form non valido');
        return;
    }

    this.authenticationService.login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(
            (data) => {
                this.router.navigate([this.returnUrl]);
            },
            (error) => {
              var errorCatch: HttpErrorResponse = error;
              if( errorCatch.status == 400) {
                this.errorMessage = 'Account non Valido!!'.toUpperCase();
              } else {
                this.errorMessage = errorCatch.message;
              }

              const dialogConfig = new MatDialogConfig();
              dialogConfig.autoFocus = true;
              dialogConfig.disableClose = true;
              dialogConfig.data = {
                messaggio: 'Account non Valido!! Reinserire username e password'.toUpperCase(), 
                titolo: 'ERRORE', 
              };          
              const dialogRef = this.dialog.open(MessageNotificationDummyComponent, dialogConfig);
              dialogRef.afterClosed().subscribe(result => {
                console.log(result);
                this.errorMessage = '';
              });                
              
            });  

    this.router.navigate(['/dashboard']);
  }

}
