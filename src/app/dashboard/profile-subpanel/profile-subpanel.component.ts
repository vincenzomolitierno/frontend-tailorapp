import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RESTBackendService } from 'src/app/backend-service/rest-backend.service';
import { AuthenticationService } from 'src/app/authentication/authentication.service';
import { first } from 'rxjs/operators';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { MessageNotificationDummyComponent } from 'src/app/utilities/message-notification-dummy/message-notification-dummy.component';
import { User } from 'src/app/authentication/data.model';

@Component({
  selector: 'app-profile-subpanel',
  templateUrl: './profile-subpanel.component.html',
  styleUrls: ['./profile-subpanel.component.css']
})
export class ProfileSubpanelComponent implements OnInit {

  public reactiveForm: FormGroup; // oggetto per gestire il form con l'approccio reactive

  username: string = '';

  hide: boolean = true;
  hide1: boolean = true;
  hide2: boolean = true;

  newPasswordsDifferent:boolean = false;
  passwordPattern = "^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){6,}$";
  

  submitted = false;

  constructor(public restBackendService: RESTBackendService,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService ) {

    this.reactiveForm = new FormGroup({
        
      username: new FormControl(''),
      vecchia_password: new FormControl(''),
      nuova_password: new FormControl('',Validators.required),
      nuova_password_2: new FormControl('',Validators.required),
          
    });
   }

  ngOnInit() {
  }

  onSubmit(){
    console.log('submit');

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;

    this.authenticationService.login(this.reactiveForm.get('username').value, 
        this.reactiveForm.get('vecchia_password').value)
        .pipe(first())
        .subscribe(
            (data) => {

              var user: User;
              user = data;

              console.log('login', user)

              console.log('body',{
                "firstName": user.firstName,
                "lastName": user.lastName,
                "username": user.username,
                "password": this.reactiveForm.get('nuova_password').value,
                "token": user.token
              });

              this.restBackendService.putResource('users',
              {
                "firstName": user.firstName,
                "lastName": user.lastName,
                "username": user.username,
                "password": this.reactiveForm.get('nuova_password').value,
                "token": null
              }).subscribe(
                (data) => {

                  dialogConfig.data = {
                    messaggio: 'Aggiornamento della Password riuscito', 
                    titolo: 'INFO', 
                  };          
                  const dialogRef = this.dialog.open(MessageNotificationDummyComponent, dialogConfig);
                  dialogRef.afterClosed();  

                },
                (error) => {
                  dialogConfig.data = {
                    messaggio: 'Aggiornamento della password non riuscito. Riprovare', 
                    titolo: 'NOTA BENE', 
                  };          
                  const dialogRef = this.dialog.open(MessageNotificationDummyComponent, dialogConfig);
                  dialogRef.afterClosed();  
                }
              );

            },
            (error) => {

              dialogConfig.data = {
                messaggio: 'L\'account inserito NON E\' VALIDO. Operazione di cambio password annullata. ' + error, 
                titolo: 'NOTA BENE', 
              };          
              const dialogRef = this.dialog.open(MessageNotificationDummyComponent, dialogConfig);
              dialogRef.afterClosed();  
                
            });  
  }

  checkNuovaPassword(event: Event) {

    console.log('nuova password',this.reactiveForm.get('nuova_password').value);
    console.log('nuova password 2',this.reactiveForm.get('nuova_password_2').value);

    if( this.reactiveForm.get('nuova_password').value == this.reactiveForm.get('nuova_password_2').value ){
      this.newPasswordsDifferent = false;
    }  else {
      this.newPasswordsDifferent = true;
    }
    console.log('different',this.newPasswordsDifferent);
  }  

  checkNuovaPassword2(event: Event) {

    console.log('nuova password',this.reactiveForm.get('nuova_password').value);
    console.log('nuova password 2',this.reactiveForm.get('nuova_password_2').value);

    if( this.reactiveForm.get('nuova_password').value == this.reactiveForm.get('nuova_password_2').value ){
      this.newPasswordsDifferent = false;
    }  else {
      this.newPasswordsDifferent = true;
    }
    console.log('different',this.newPasswordsDifferent);
  }  

  get nuova_password_2() {
    return this.reactiveForm.get('nuova_password_2');
  }

  get nuova_password() {
    return this.reactiveForm.get('nuova_password');
  }
}
